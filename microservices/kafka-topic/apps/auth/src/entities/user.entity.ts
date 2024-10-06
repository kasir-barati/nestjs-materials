import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isStrongPassword } from 'class-validator';
import { strongPasswordConf } from '../constants/password.constant';

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop({
    unique: true,
    required: true,
    validate: {
      validator(value: string) {
        return isEmail(value);
      },
      message({ value }) {
        return `${value} is not a valid email address!`;
      },
    },
  })
  email: string;

  @Prop({
    required: true,
    validate: {
      validator(value: string) {
        return isStrongPassword(value, strongPasswordConf);
      },
      message({ value }) {
        return `${value} is not a valid password!`;
      },
    },
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
