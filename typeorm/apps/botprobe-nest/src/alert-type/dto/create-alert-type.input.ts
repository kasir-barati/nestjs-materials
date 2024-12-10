import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAlertTypeInput {
  @Field({ description: 'Alert type name' })
  name: string;

  @Field({ description: 'Alert type description' })
  description: string;
}
