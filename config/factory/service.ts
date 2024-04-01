import { FusionAuthClient } from "@fusionauth/typescript-client";

export class Service {
  constructor(private readonly fusionAuthClient: FusionAuthClient) {}
}
