import { Resolver } from '@nestjs/graphql';
import { AlertService } from './alert.service';
import { AlertDto } from './dto/alert.dto';

@Resolver(() => AlertDto)
export class AlertResolver {
  constructor(private readonly alertService: AlertService) {}
}
