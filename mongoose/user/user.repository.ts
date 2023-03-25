import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    public readonly userModel: Model<UserDocument>
  ) {}
}
