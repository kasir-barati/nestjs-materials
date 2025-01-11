import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtToken {
  @Field()
  accessToken: string;
}
