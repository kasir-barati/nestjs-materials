import { Field, ObjectType } from '@nestjs/graphql';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import {
  BeforeCreateOne,
  FilterableField,
  FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import { SharedAlert } from 'shared';
import { AlertTypeDto } from '../../alert-type/dto/alert-type.dto';
import { BeforeCreateAlertHook } from '../hooks/before-create-alert.hook';

@ObjectType('Alert')
@BeforeCreateOne(BeforeCreateAlertHook)
// Note: When you have your DTO separate from your ENTITY model you have to be careful where you're using which one.
// E.g. I was using AlertType here mistakenly and my app was crashing...
@FilterableRelation('alertType', () => AlertTypeDto, {
  update: { enabled: true },
  defaultSort: [
    { field: 'createdAt', direction: SortDirection.ASC },
    { field: 'id', direction: SortDirection.ASC },
  ],
})
export class AlertDto implements Omit<SharedAlert, 'alertType'> {
  @Field({ description: 'ID of the alert' })
  id: string;

  @Field({ description: 'Name of the alert' })
  @FilterableField()
  title: string;

  @Field({ description: 'Description of the alert' })
  description: string;

  @Field({ description: "Who's the creator of this alert" })
  @FilterableField()
  userId: string;

  // Do not need this guy since FilterableRelation decorator enables me to filter data based on alertType.id
  // @FilterableField()
  @Field({
    description: 'To which alert type this alert belongs',
    nullable: true,
  })
  alertTypeId: string | null;

  @Field({ description: 'Creation date of the alert' })
  @FilterableField()
  createdAt: Date;

  @Field({
    description: "Date of last time that we've updated this alert",
  })
  updatedAt: Date;
}
