import { registerAs } from '@nestjs/config';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsString, ValidateNested, validateSync } from 'class-validator';
import { AuthConfig, KeycloakSecret } from './auth.type';

export default registerAs('authConfigs', (): AuthConfig => {
  const validatedEnvs = validate(process.env);
  const config: AuthConfig = {
    keycloakSecret: validatedEnvs.KEYCLOAK_SECRET,
  };

  return config;
});

class KeycloakSecretValidator implements KeycloakSecret {
  @IsString()
  authorization_server_url: string;

  @IsString()
  client_id: string;

  @IsString()
  secret: string;

  @IsString()
  realm: string;
}

class EnvironmentVariables {
  @ValidateNested()
  @Transform(({ value }) => JSON.parse(value))
  @Type(() => KeycloakSecretValidator)
  KEYCLOAK_SECRET: KeycloakSecret;
}

function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfigs = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const validatedConfigsErrors = validateSync(validatedConfigs, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
    forbidNonWhitelisted: true,
  });

  if (validatedConfigsErrors.length > 0) {
    // FIXME:
    console.dir({
      errors: validatedConfigsErrors.map((error) => ({
        value: error.value,
        property: error.property,
        message: Object.values(error.constraints!)[0],
      })),
      errorCode: 'required_environment_variables_loading_failed',
      message: 'Application could not load required environment variables',
    });
    throw new Error(validatedConfigsErrors.toString());
  }

  return validatedConfigs;
}
