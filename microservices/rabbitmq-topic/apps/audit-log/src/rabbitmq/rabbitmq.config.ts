import {
  AUDIT_LOG_QUEUE,
  CREATED_ROUTING_KEY,
  DELETED_ROUTING_KEY,
  TOPIC_EXCHANGE,
  UPDATED_ROUTING_KEY,
} from '@app/common';
import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import auditLogApiConfig from '../configs/audit-log.config';

export class RabbitmqModuleConfig
  implements ModuleConfigFactory<RabbitMQConfig>
{
  constructor(
    @Inject(auditLogApiConfig.KEY)
    private readonly auditLogApiConfigs: ConfigType<
      typeof auditLogApiConfig
    >,
  ) {}

  createModuleConfig(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.auditLogApiConfigs;

    return {
      uri: RABBITMQ_URL,
      exchanges: [
        {
          name: TOPIC_EXCHANGE,
          type: 'topic',
        },
      ],
      queues: [
        {
          name: AUDIT_LOG_QUEUE,
          routingKey: [
            CREATED_ROUTING_KEY,
            UPDATED_ROUTING_KEY,
            DELETED_ROUTING_KEY,
          ],
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
