import {DefaultCrudRepository} from '@loopback/repository';
import {Vote} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class VoteRepository extends DefaultCrudRepository<
  Vote,
  typeof Vote.prototype._id
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(Vote, dataSource);
  }
}
