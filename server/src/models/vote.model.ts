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
    type: 'string',
    required: true,
  })
  resourceid: string;

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
    type: 'number',
    generated: true,
    default: new Date().getTime(),
  })
  timestamp: number;


  constructor(data?: Partial<Vote>) {
    super(data);
  }
}
