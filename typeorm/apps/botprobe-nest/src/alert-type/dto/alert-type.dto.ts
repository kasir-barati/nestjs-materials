import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import {
  CursorConnection,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { AlertDto } from '../../alert/dto/alert.dto';

@ObjectType('AlertType')
@CursorConnection('alerts', () => AlertDto, {
  update: { enabled: true },
})
export class AlertTypeDto {
  @IDField(() => ID, { description: 'ID of the alert type' })
  @FilterableField()
  id: string;

  @Field({ description: 'Name of the alert type' })
  @FilterableField()
  name: string;

  @Field({ description: 'Description of the alert type' })
  description: string;

  @Field(() => GraphQLISODateTime, {
    description: 'Creation date of the alert type',
  })
  @FilterableField()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description:
      "Date of last time that we've updated this alert type",
  })
  updatedAt: Date;
}
