import { generateRandomString } from '@app/common';
import axios from 'axios';

export class UserBuilder {
  private email: string;
  private password: string;

  constructor() {
    this.email = generateRandomString() + '@reservation.tv';
    this.password = generateRandomString() + '1' + 'B' + '#';
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
  async build(): Promise<string> {
    const { AUTH_SERVICE_PORT } = process.env;
    const { data } = await axios.put(
      `http://localhost:${AUTH_SERVICE_PORT}/users`,
      {
        email: this.email,
        password: this.password,
      },
    );

    return data;
  }
}
