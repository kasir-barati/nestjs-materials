import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User, UserDocument } from "../../user/entities/user.entity";

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  autoIndex: true,
  validateBeforeSave: true,
  strict: true,
  selectPopulatedPaths: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  User?: UserDocument;

  @Prop({ maxlength: 200, minlength: 5 })
  name: string;

  @Prop({ required: false })
  content?: string;

  @Prop({ default: false })
  published: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// await this.postModel.find().populate('User')
PostSchema.virtual("User", {
  ref: User.name,
  localField: "userId",
  foreignField: "_id",
});
