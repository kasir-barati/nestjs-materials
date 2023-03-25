import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { isEmail } from "class-validator";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  autoIndex: true,
  validateBeforeSave: true,
  strict: true,
  selectPopulatedPaths: true,
})
export class User {
  @Prop({
    maxlength: 200,
    required: false,
  })
  name?: string;

  @Prop({
    maxlength: 200,
    required: false,
  })
  family?: string;

  location: any;
  occupation: any;
  socialLinks: any[];

  @Prop({
    unique: true,
    required: true,
    validate: {
      validator: (value: string) => {
        return isEmail(value);
      },
      message: "Please enter a valid email",
    },
  })
  email: string;

  @Prop({
    unique: true,
    required: true,
    maxlength: 200,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: false,
  })
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
