import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { AlertTypeResolver } from './alert-type.resolver';
import { AlertTypeService } from './alert-type.service';
import { AlertTypeDto } from './dto/alert-type.dto';
import { CreateAlertTypeInput } from './dto/create-alert-type.input';
import { UpdateAlertTypeInput } from './dto/update-alert-type.input';
import { AlertType } from './entities/alert-type.entity';

@Module({
  imports: [
    // TypeOrmModule.forFeature([AlertType]),
    NestjsQueryGraphQLModule.forFeature({
      // NestjsQueryTypeOrmModule will register the entity with typeorm. It provides a QueryService too.
      imports: [NestjsQueryTypeOrmModule.forFeature([AlertType])],
      resolvers: [
        {
          EntityClass: AlertType,
          DTOClass: AlertTypeDto,
          CreateDTOClass: CreateAlertTypeInput,
          UpdateDTOClass: UpdateAlertTypeInput,
        },
      ],
    }),
  ],
  providers: [AlertTypeResolver, AlertTypeService],
})
export class AlertTypeModule {}
