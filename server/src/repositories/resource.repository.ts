import {
    DefaultCrudRepository,
    juggler,
    repository,
} from '@loopback/repository';
import {Resource, Vote} from '../models';
import {VoteRepository} from './vote.repository';
import {MemoryDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';

export class ResourceRepository extends DefaultCrudRepository<
    Resource,
    typeof Resource.prototype._id
> {
    public voteRepository: Promise<VoteRepository>;
    constructor(
        @inject('datasources.memory') dataSource: MemoryDataSource,
        @repository.getter(VoteRepository)
        getVoteRepository: Getter<VoteRepository>,
    ) {
        super(Resource, dataSource);
        this.voteRepository = getVoteRepository();
    }
}
