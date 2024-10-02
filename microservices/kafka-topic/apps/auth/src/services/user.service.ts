import {
  MESSAGE_PRODUCER,
  MessageProducerService,
} from '@app/common';
import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateOrUpdateUserDto } from '../dto/create-or-update-user.dto';
import { User } from '../entities/user.entity';
import {
  UserCreatedEvent,
  UserUpdatedEvent,
} from '../types/events.type';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(MESSAGE_PRODUCER)
    private readonly messageProducerService: MessageProducerService,
  ) {}

  async updateUser({
    id,
    user,
    requestId,
    createOrUpdateUserDto,
  }: {
    id: string;
    user: User;
    requestId: string;
    createOrUpdateUserDto: CreateOrUpdateUserDto;
  }) {
    this.validateBeforeUpdate(createOrUpdateUserDto);

    const session = await this.userRepository.startSession();

    session.startTransaction();

    try {
      const updatedUser = await this.userRepository.update(
        id,
        {
          ...createOrUpdateUserDto,
        },
        session,
      );
      const { password: previousPassword, ...beforeEvent } = user;
      const { password: currentPassword, ...afterEvent } =
        updatedUser;
      const tags = ['users'];

      if (previousPassword !== currentPassword) {
        tags.push('reset-password');
      }

      const event: UserUpdatedEvent = {
        tags,
        requestId,
        afterEvent,
        beforeEvent,
        eventType: 'update',
        userId: user._id.toString(),
        timestamp: new Date().toISOString(),
      };

      await this.messageProducerService.produceTo(
        'users',
        JSON.stringify(event),
      );
      await session.commitTransaction();

      return updatedUser;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  async createUser({
    id,
    requestId,
    createOrUpdateUserDto,
  }: {
    id: string;
    requestId: string;
    createOrUpdateUserDto: CreateOrUpdateUserDto;
  }) {
    this.validateBeforeCreate(createOrUpdateUserDto);

    const session = await this.userRepository.startSession();

    session.startTransaction();

    try {
      const createdUser = await this.userRepository.create({
        _id: id,
        ...createOrUpdateUserDto,
      });
      const { password: _, ...afterEvent } = createdUser;
      const event: UserCreatedEvent = {
        requestId,
        afterEvent,
        tags: ['users'],
        eventType: 'create',
        beforeEvent: undefined,
        userId: createdUser._id.toString(),
        timestamp: new Date().toISOString(),
      };

      await this.messageProducerService.produceTo(
        'users',
        JSON.stringify(event),
      );
      await session.commitTransaction();

      return createdUser;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  private validateBeforeUpdate({
    email,
    password,
  }: CreateOrUpdateUserDto): never | void {
    if (email === null) {
      throw new BadRequestException('RequiredEmail');
    }
    if (password === null) {
      throw new BadRequestException('RequiredPassword');
    }
  }

  private validateBeforeCreate({
    email,
    password,
  }: CreateOrUpdateUserDto): never | void {
    if (!email) {
      throw new BadRequestException('RequiredEmail');
    }
    if (!password) {
      throw new BadRequestException('RequiredPassword');
    }
  }
}
