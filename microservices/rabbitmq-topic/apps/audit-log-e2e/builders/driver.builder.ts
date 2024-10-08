import { generateRandomString } from '@app/testing';
import axios from 'axios';
import { Types } from 'mongoose';

export class DriverBuilder {
  private id = new Types.ObjectId().toString();
  private name = generateRandomString();
  private family = generateRandomString();
  private gender = 'male';
  private birthday = new Date().toISOString();

  setId(id: string) {
    this.id = id;
    return this;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setFamily(family: string) {
    this.family = family;
    return this;
  }

  setGender(gender: 'male' | 'female' | 'other') {
    this.gender = gender;
    return this;
  }

  setBirthday(birthday: string) {
    this.birthday = birthday;
    return this;
  }

  async build() {
    await axios.patch(
      `http://localhost:${process.env.DRIVER_API_PORT}/drivers/${this.id}`,
      {
        name: this.name,
        family: this.family,
        gender: this.gender,
        birthday: this.birthday,
      },
      {
        headers: {
          'content-type': 'application/merge-patch+json',
        },
      },
    );
  }
}
