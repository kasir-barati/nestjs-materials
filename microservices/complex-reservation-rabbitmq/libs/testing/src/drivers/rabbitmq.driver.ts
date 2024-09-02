import { Channel, connect, Connection, Options } from 'amqplib';

export class RabbitMqDriver {
  private rabbitMqUrl: string =
    'amqp://rabbitmq:password@localhost:5672';
  private queueName: string;
  private connection: Connection;
  private channel: Channel;

  constructor({
    queueName,
    rabbitMqUrl,
  }: {
    rabbitMqUrl?: string;
    queueName: string;
  }) {
    this.queueName = queueName;
    this.rabbitMqUrl = rabbitMqUrl;
  }

  async getChannel(options?: Options.AssertQueue): Promise<Channel> {
    this.connection = await connect(this.rabbitMqUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, options);

    return this.channel;
  }
  async waitForEvent() {
    return new Promise<string>((resolve) => {
      this.channel.consume(this.queueName, (msg) => {
        resolve(msg.content.toString('utf-8'));
      });
    });
  }
  async cleanup(): Promise<void> {
    await this.channel.purgeQueue(this.queueName);
    await this.connection.close();
  }
}
