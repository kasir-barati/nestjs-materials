import { Resolver } from '@nestjs/graphql';
import { AlertTypeService } from './alert-type.service';
import { AlertType } from './entities/alert-type.entity';

@Resolver(() => AlertType)
export class AlertTypeResolver {
  constructor(private readonly alertTypeService: AlertTypeService) {}
}
