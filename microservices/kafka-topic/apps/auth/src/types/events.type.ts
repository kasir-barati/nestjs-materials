import { KafkaEvent } from '@app/common';
import { User } from '../entities/user.entity';

type UserWithoutPassword = Omit<User, 'password'>;

export type UserCreatedEvent = KafkaEvent<
  undefined,
  UserWithoutPassword
>;
export type UserUpdatedEvent = KafkaEvent<
  UserWithoutPassword,
  UserWithoutPassword
>;
