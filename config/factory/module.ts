import { fusionAuthClientFactory } from "./fusionauth-client.factory";

@Module({
  providers: [fusionAuthClientFactory],
})
export class Module {}
