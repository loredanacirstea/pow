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
    required: true,
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
    required: true,
  })
  paymentIdentifier: number;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;


  constructor(data?: Partial<Vote>) {
    super(data);
  }
}
