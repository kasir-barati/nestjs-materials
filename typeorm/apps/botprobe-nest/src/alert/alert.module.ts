import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { AlertResolver } from './alert.resolver';
import { AlertService } from './alert.service';
import { CreateAlertInput } from './dto/create-alert.input';
import { Alert } from './entities/alert.entity';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Alert]),
    NestjsQueryGraphQLModule.forFeature({
      // NestjsQueryTypeOrmModule will register the entity with typeorm. It provides a QueryService too.
      imports: [NestjsQueryTypeOrmModule.forFeature([Alert])],
      resolvers: [
        {
          EntityClass: Alert,
          DTOClass: Alert,
          CreateDTOClass: CreateAlertInput,
        },
      ],
    }),
  ],
  providers: [AlertResolver, AlertService],
})
export class AlertModule {}
