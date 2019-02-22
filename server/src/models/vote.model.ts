import {Entity, model, property} from '@loopback/repository';

@model()
export class Vote extends Entity {
    @property({
      type: 'number',
      id: true,
      generated: true,
    })
    _id: string;

  @property({
    type: 'string',
  })
  iphash: string;

  @property({
    type: 'number',
    required: true,
  })
  resourceid: number;

  @property({
    type: 'number',
    required: true,
  })
  optionid: number;

  @property({
    type: 'number',
  })
  paymentIdentifier: number;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: string;


  constructor(data?: Partial<Vote>) {
    super(data);
  }
}
