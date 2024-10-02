import { User } from '../entities/user.entity';

export interface CreateOrUpdateUserReturnType {
  status: 'created' | 'updated';
  data: User;
}
