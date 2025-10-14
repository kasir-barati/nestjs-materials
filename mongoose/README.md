# Mongoose

- [Auto index creation in DocumentDB](./documentdb-index-creation/README.md).
- [An array of discriminators](./documentdb-index-creation/src/app/schemas/post.schema.ts).
- [One to many](./one-to-many).
- [Transactions](./transactions/README.md).

## Bulk Create

```ts
export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true, autoCreate: true })
export class Post {
  @Prop({
    type: String,
    required: true,
  })
  title: string;
}

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>
  ) {}

  async someMethod() {
    const res = await this.postModel.insertMany([
      { title: randomUUID() },
      { title: randomUUID() },
    ]);
    console.log("=================", Array.isArray(res)); // true
    console.log("=================", res.length); // 2
    console.log("=================", res[0].title); // 3604b886-c1ea-47cd-93d2-111fa3d1dcb9
  }
}
```
