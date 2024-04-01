import { FusionAuthClient } from "@fusionauth/typescript-client";
import { FactoryProvider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FusionAuthClientConfig } from "./auth.type";

export const fusionAuthClientFactory: FactoryProvider<FusionAuthClient> = {
  provide: FusionAuthClient,
  useFactory: (configsService: ConfigService<FusionAuthClientConfig>) => {
    const FUSIONAUTH_API_KEY = configsService.get("FUSIONAUTH_API_KEY");
    const FUSIONAUTH_HOST = configsService.get("FUSIONAUTH_HOST");
    const FUSIONAUTH_TENANT_ID = configsService.get("FUSIONAUTH_TENANT_ID");

    return new FusionAuthClient(
      FUSIONAUTH_API_KEY,
      FUSIONAUTH_HOST,
      FUSIONAUTH_TENANT_ID
    );
  },
  inject: [ConfigService],
};
