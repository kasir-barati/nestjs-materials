import { generateRandomString } from '@app/common';
import { UserServiceApi } from '../../api-client';

export class UserBuilder {
  private email: string;
  private password: string;
  private readonly userServiceApi: UserServiceApi;

  constructor() {
    this.email = generateRandomString() + '@same.tv';
    this.password = generateRandomString() + '1' + 'B' + '#';
    this.userServiceApi = new UserServiceApi();
  }

  setEmail(value: string) {
    this.email = value;
    return this;
  }
  setPassword(value: string) {
    this.password = value;
    return this;
  }
  /**
   * @returns user id
   */
  async build() {
    const { data } = await this.userServiceApi.userControllerCreate({
      createUserDto: { email: this.email, password: this.password },
    });

    return data;
  }
}
