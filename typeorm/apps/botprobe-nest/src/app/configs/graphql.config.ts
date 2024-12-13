import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import appConfig from './app.config';

export class GraphQLConfig implements GqlOptionsFactory {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}

  createGqlOptions():
    | ApolloDriverConfig
    | Promise<ApolloDriverConfig> {
    return {
      playground: false,
      autoSchemaFile: join(__dirname, 'src', 'schema.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      debug: this.appConfigs.NODE_ENV !== 'production',
    };
  }
}
