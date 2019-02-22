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
} from '@loopback/rest';
import {Vote} from '../models';
import {VoteRepository} from '../repositories';

export class VoteController {
  constructor(
    @repository(VoteRepository)
    public voteRepository : VoteRepository,
  ) {}

  @post('/vote', {
    responses: {
      '200': {
        description: 'Vote model instance',
        content: {'application/json': {schema: {'x-ts-type': Vote}}},
      },
    },
  })
  async create(@requestBody() vote: Partial<Vote>): Promise<Vote> {
    return await this.voteRepository.create(vote);
  }

  @get('/vote/count', {
    responses: {
      '200': {
        description: 'Vote model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Vote)) where?: Where,
  ): Promise<Count> {
    return await this.voteRepository.count(where);
  }

  @get('/vote', {
    responses: {
      '200': {
        description: 'Array of Vote model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Vote}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Vote)) filter?: Filter,
  ): Promise<Vote[]> {
    return await this.voteRepository.find(filter);
  }

  @patch('/vote', {
    responses: {
      '200': {
        description: 'Vote PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() vote: Vote,
    @param.query.object('where', getWhereSchemaFor(Vote)) where?: Where,
  ): Promise<Count> {
    return await this.voteRepository.updateAll(vote, where);
  }

  @get('/vote/{id}', {
    responses: {
      '200': {
        description: 'Vote model instance',
        content: {'application/json': {schema: {'x-ts-type': Vote}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Vote> {
    return await this.voteRepository.findById(id);
  }

  @patch('/vote/{id}', {
    responses: {
      '204': {
        description: 'Vote PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() vote: Vote,
  ): Promise<void> {
    await this.voteRepository.updateById(id, vote);
  }

  @put('/vote/{id}', {
    responses: {
      '204': {
        description: 'Vote PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() vote: Vote,
  ): Promise<void> {
    await this.voteRepository.replaceById(id, vote);
  }

  @del('/vote/{id}', {
    responses: {
      '204': {
        description: 'Vote DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.voteRepository.deleteById(id);
  }
}
