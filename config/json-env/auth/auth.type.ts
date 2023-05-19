export interface KeycloakSecret {
    authorization_server_url: string;
    client_id: string;
    secret: string;
    realm: string;
}

export interface AuthConfig {
    keycloakSecret: KeycloakSecret;
}
