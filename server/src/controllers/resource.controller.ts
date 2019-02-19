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
import {Resource} from '../models';
import {ResourceRepository} from '../repositories';

export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository : ResourceRepository,
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
}
