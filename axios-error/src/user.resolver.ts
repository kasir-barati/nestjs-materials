import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "@nestjs/graphql";

import { UserService } from "./user.service";

@ObjectType()
class UserResult {
  @Field()
  ok!: boolean;

  @Field({ nullable: true })
  payload?: string;
}

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => UserResult, {
    description: "Calls upstream /forbidden (returns 403).",
  })
  async userForbiddenQuery(): Promise<UserResult> {
    const payload = await this.userService.fetchForbidden();

    return { ok: true, payload: JSON.stringify(payload) };
  }

  @Query(() => UserResult, {
    description: "Calls upstream /forbidden (returns 403) but we map the error internally.",
  })
  async userMappedForbiddenQuery(): Promise<UserResult> {
    const payload = await this.userService.fetchForbidden();

    return { ok: true, payload: JSON.stringify(payload) };
  }

  @Query(() => UserResult, {
    description: "Calls upstream /not-found (returns 404).",
  })
  async userNotFoundQuery(
    @Args("id", { type: () => String, nullable: true }) _id?: string,
  ): Promise<UserResult> {
    const payload = await this.userService.fetchNotFound();

    return { ok: true, payload: JSON.stringify(payload) };
  }

  @Mutation(() => UserResult, {
    description: "Calls upstream /bad-request (returns 400).",
  })
  async userBadRequestMutation(
    @Args("name", { type: () => String, nullable: true }) _name?: string,
  ): Promise<UserResult> {
    const payload = await this.userService.postBadRequest();

    return { ok: true, payload: JSON.stringify(payload) };
  }

  @Mutation(() => UserResult, {
    description: "Calls upstream /conflict (returns 409).",
  })
  async userConflictMutation(
    @Args("name", { type: () => String, nullable: true }) _name?: string,
  ): Promise<UserResult> {
    const payload = await this.userService.postConflict();

    return { ok: true, payload: JSON.stringify(payload) };
  }
}
