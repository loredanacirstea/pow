import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  Request,
  RestBindings,
  HttpErrors,
} from '@loopback/rest';
import {sha3_256} from 'js-sha3';
import {Context} from '@loopback/context';
import {Resource} from '../models';
import {ResourceRepository} from '../repositories';
import {VoteController} from './vote.controller';
import {Raiden} from './raiden.controller';
import {RaidenDataSource} from '../datasources';
import {TOKEN, ADDR, TOKEN_AMOUNT_WEI} from '../constants';

export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository : ResourceRepository,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @post('/resource', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: {'application/json': {schema: {'x-ts-type': Resource}}},
      },
    },
  })
  async create(@requestBody() resource: Resource): Promise<Resource> {
    resource.timestamp = new Date().getTime();
    resource.startDate = resource.startDate || new Date().getTime();
    resource.endDate = resource.endDate || new Date().getTime();
    return await this.resourceRepository.create(resource);
  }

  @get('/resource/count', {
    responses: {
      '200': {
        description: 'Resource model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where,
  ): Promise<Count> {
    return await this.resourceRepository.count(where);
  }

  @get('/resource', {
    responses: {
      '200': {
        description: 'Array of Resource model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Resource}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Resource)) filter?: Filter,
  ): Promise<Resource[]> {
    return await this.resourceRepository.find(filter);
  }

  @patch('/resource', {
    responses: {
      '200': {
        description: 'Resource PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() resource: Resource,
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where,
  ): Promise<Count> {
    return await this.resourceRepository.updateAll(resource, where);
  }

  @get('/resource/{id}', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: {'application/json': {schema: {'x-ts-type': Resource}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Resource> {
    return await this.resourceRepository.findById(id);
  }

  @patch('/resource/{id}', {
    responses: {
      '204': {
        description: 'Resource PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.updateById(id, resource);
  }

  @put('/resource/{id}', {
    responses: {
      '204': {
        description: 'Resource PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.replaceById(id, resource);
  }

  @del('/resource/{id}', {
    responses: {
      '204': {
        description: 'Resource DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.resourceRepository.deleteById(id);
  }

  @get('/resource/{id}/count/vote', {
    responses: {
      '200': {
        description: 'Resource votes per voter count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async countVotesPerIp(
    @param.path.string('id') id: string,
  ): Promise<Count> {
    let countVotesPerIp;

    let voteRepository = await this.resourceRepository.voteRepository;
    let voteController = new VoteController(voteRepository);

    const iphash = this.getClientHashIp(this.request);
    return await voteController.count({
        resourceid: id,
        iphash,
    });
  }

  @get('/resource/{id}/vote/{optionid}', {
    responses: {
      '200': {
        description: 'Vote count per voter IP hash',
        content: {'application/json': {schema: {'x-ts-type': CountSchema}}},
      },
    },
  })
  async vote(
    @param.path.string('id') id: string,
    @param.path.number('optionid') optionid: number,
  ): Promise<Count> {
    let resource, countVotesPerIp;

    let voteRepository = await this.resourceRepository.voteRepository;
    let voteController = new VoteController(voteRepository);

    const iphash = this.getClientHashIp(this.request);
    countVotesPerIp = await this.countVotesPerIp(id);

    resource = await this.resourceRepository.findById(id);
    if (!resource) {
        throw new HttpErrors.NotFound('Resource not found, cannot vote');
    }

    if (countVotesPerIp.count >= resource.votesPerPerson) {
        throw new HttpErrors.Forbidden('Voter has reached the number of allowed votes');
    }

    if (resource.startDate > new Date().getTime()) {
        throw new HttpErrors.Forbidden(`Voting is permitted only after ${resource.startDate}`);
    }

    if (resource.endDate < new Date().getTime()) {
        throw new HttpErrors.Forbidden(`Voting has ended at ${new Date(resource.endDate)}`);
    }

    // TODO raiden payment (don't wait for success)

    this.sendRaidenPayment(TOKEN, ADDR.target, TOKEN_AMOUNT_WEI).catch((error) => {
        console.log(error);
    });

    let vote = await voteController.create({
        iphash,
        resourceid: id,
        optionid,
    });
    if (vote) {
        resource.options[optionid].votes ++;
        countVotesPerIp.count ++;
        this.resourceRepository.updateById(id, {options: resource.options});
    }

    return {count: resource.votesPerPerson - countVotesPerIp.count};
  }

    getClientHashIp(req: Request): string {
        const clientIp = req.header('x-forwarded-for') || req.ip;
        const iphash = sha3_256(clientIp);
        console.log('iphash', iphash);
        return iphash;
    }

    async sendRaidenPayment(token: string, target: string, amount: number): Promise<any> {
        const context: Context = new Context();
        context.bind('datasources.raiden').to(RaidenDataSource);
        context.bind('controllers.Raiden').toClass(Raiden);
        const raiden = await context.get<Raiden>(
        'controllers.Raiden',
        );
        return await raiden.raiden.pay(token, target, amount);
    }
}
