import { Resolver } from '@nestjs/graphql';
import { AlertTypeService } from './alert-type.service';
import { AlertTypeDto } from './dto/alert-type.dto';

@Resolver(() => AlertTypeDto)
export class AlertTypeResolver {
  constructor(private readonly alertTypeService: AlertTypeService) {}
}
