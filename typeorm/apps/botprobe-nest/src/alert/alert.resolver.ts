import { Resolver } from '@nestjs/graphql';
import { AlertService } from './alert.service';
import { Alert } from './entities/alert.entity';

@Resolver(() => Alert)
export class AlertResolver {
  constructor(private readonly alertService: AlertService) {}
}
