import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';

@Module({
  imports: [UserModule],
  controllers: [OrderController],
})
export class OrderModule {}
