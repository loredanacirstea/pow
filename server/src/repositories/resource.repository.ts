import {DefaultCrudRepository} from '@loopback/repository';
import {Resource} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ResourceRepository extends DefaultCrudRepository<
  Resource,
  typeof Resource.prototype._id
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(Resource, dataSource);
  }
}
