import { Metadata } from '@grpc/grpc-js';
import { HttpToGrpcExceptionFilter } from '@grpc/shared';
import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Ctx, Payload } from '@nestjs/microservices';
import { IsUUID } from 'class-validator';
import { Observable } from 'rxjs';

import {
  GrpcUserServiceController,
  GrpcUserServiceControllerMethods,
  User,
  UserById,
} from '../assets/interfaces/user.interface';

class UserByIdDto implements UserById {
  @IsUUID()
  id: string;
}

@Controller()
@UseFilters(HttpToGrpcExceptionFilter)
@GrpcUserServiceControllerMethods()
export class UserGrpcController implements GrpcUserServiceController {
  @UsePipes(new ValidationPipe())
  findOne(
    @Payload() request: UserByIdDto,
    @Ctx() metadata: Metadata,
  ): Promise<User> | Observable<User> | User {
    console.log(metadata.toJSON());

    return { id: request.id, name: 'somename' };
  }
}
