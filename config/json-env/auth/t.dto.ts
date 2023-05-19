import { IsString, ValidateNested } from 'class-validator';
import { KeycloakSecret } from './auth.type';
import { Type } from 'class-transformer';

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

export class T {
  @ValidateNested()
  @Type(() => KeycloakSecretValidator)
  KEYCLOAK_SECRET: KeycloakSecret;
}
