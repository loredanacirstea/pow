import {Entity, Model, model, property} from '@loopback/repository';

@model()
export class Option extends Model {
    @property({
      type: 'string',
      required: true,
    })
    name: string;

    @property({
      type: 'string',
      required: true,
    })
    token: string;

    @property({
      type: 'string',
      required: true,
    })
    taget: string;

    @property({
      type: 'number',
      required: true,
    })
    channelid: number;

    @property({
      type: 'number',
      required: true,
    })
    amount: number;
}

@model()
export class Resource extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
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
  options: Option[];


  constructor(data?: Partial<Resource>) {
    super(data);
  }
}
