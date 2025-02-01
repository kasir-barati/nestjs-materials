import { NotificationRabbitmqModule } from '@grpc/modules';
import { Module } from '@nestjs/common';

import { UserGrpcController } from './user.grpc-controller';
import { UserService } from './user.service';

@Module({
  imports: [NotificationRabbitmqModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserGrpcController],
})
export class UserModule {}
