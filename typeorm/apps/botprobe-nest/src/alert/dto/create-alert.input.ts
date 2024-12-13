import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAlertInput {
  @Field({ description: 'Alert title' })
  title: string;

  @Field({ description: 'Alert description' })
  description: string;

  @Field({ description: 'Alert type ID of this alert' })
  alertTypeId: string;
}
