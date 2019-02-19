import {Entity, model, property} from '@loopback/repository';

@model()
export class Resource extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  startDate: string;

  @property({
    type: 'date',
    required: true,
  })
  endDate: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  options: object[];


  constructor(data?: Partial<Resource>) {
    super(data);
  }
}
