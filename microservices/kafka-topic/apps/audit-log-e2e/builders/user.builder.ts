import { generateRandomString } from '@app/testing';
import axios from 'axios';
import { Types } from 'mongoose';

export class UserBuilder {
  private id: string;
  private email: string;
  private password: string;

  constructor() {
    this.id = new Types.ObjectId().toString();
    this.email = generateRandomString() + '@asd.xasd';
    this.password = generateRandomString() + 123 + 'ASD';
  }

  setId(value: string) {
    this.id = value;
    return this;
  }

  setEmail(value: string) {
    this.email = value;
    return this;
  }

  setPassword(value: string) {
    this.password = value;
    return this;
  }

  async build() {
    const { AUTH_API_PORT } = process.env;
    const { data } = await axios.patch(
      `http://localhost:${AUTH_API_PORT}/auth/${this.id}`,
      {
        email: this.email,
        password: this.password,
      },
      {
        headers: {
          'content-type': 'application/merge-patch+json',
        },
      },
    );

    return data;
  }
}
