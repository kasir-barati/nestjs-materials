import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [
    HttpModule.register({}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
    }),
  ],
  providers: [UserService, UserResolver],
})
export class AppModule { }
