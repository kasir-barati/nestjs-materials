import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { urlBuilder } from '../../utils';
import { CustomLoggerService } from '../logger';

interface ApplyPolicy {
  /** @example '/' */
  vhost: string;
  policyName: string;
  /** @description Pattern to match the queue names we want to apply this policy to */
  queueNameRegex: string;
  deliveryLimit: number;
  deadLetterExchange: string;
  deadLetterRoutingKey: string;
}

@Injectable()
export class RabbitmqPolicyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async upsertDeliveryLimitPolicy(args: ApplyPolicy) {
    const base = this.configService.getOrThrow('RABBITMQ_HTTP_BASE_URL')!;
    const user = this.configService.getOrThrow('RABBITMQ_DEFAULT_USER');
    const pass = this.configService.getOrThrow('RABBITMQ_DEFAULT_PASS');
    const rabbitmqHttpUrl = urlBuilder(
      base,
      '/api/policies',
      encodeURIComponent(args.vhost),
      encodeURIComponent(args.policyName),
    );
    const definition: Record<string, unknown> = {
      'delivery-limit': args.deliveryLimit,
      'dead-letter-exchange': args.deadLetterExchange,
      'dead-letter-routing-key': args.deadLetterRoutingKey,
    };
    const payload = {
      pattern: args.queueNameRegex,
      definition,
      priority: 10,
      'apply-to': 'queues',
    };

    await firstValueFrom(
      this.httpService.put(rabbitmqHttpUrl, payload, {
        auth: { username: user, password: pass },
      }),
    );

    this.logger.log(
      `Upserted policy '${args.policyName}' on vhost '${args.vhost}' with delivery-limit=${args.deliveryLimit}`,
      { context: RabbitmqPolicyService.name },
    );
  }
}
