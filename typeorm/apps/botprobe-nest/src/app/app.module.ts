import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from 'shared';
import { AlertTypeModule } from '../alert-type/alert-type.module';
import { AlertModule } from '../alert/alert.module';
import appConfig from './configs/app.config';
import { GraphQLConfig } from './configs/graphql.config';
import { TypeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: [join(__dirname, '..', '..', '.env')],
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfig,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: GraphQLConfig,
    }),
    AuthModule,
    AlertModule,
    AlertTypeModule,
  ],
})
export class AppModule {}
