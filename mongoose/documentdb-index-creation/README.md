# DocumentDB Index Creation Automation

So the problem with DocumentDB is that it will not create the indexes we've defined in our NestJS/NodeJS app automatically unlike the MongoDB itself. To see the issue you can start by checking out to [this commit sha](https://github.com/kasir-barati/nestjs-materials/tree/21c9227a2c2e5b114fd0edefa7146a55afc1d1c0/microservices/grpc/apps/file-upload/src/app) app and then try start the app and then opening the [localhost:9002](http://localhost:9002) in your browser:

```bash
docker compose up -d
```

The username and password for the mongo-express is "root" and "pass". Then you can open the `my-awesome-auto-index-db` database and go to `posts` collection, there you'll see all the indexes who have been created automatically.

## Solution

You need to hook into the `onApplicationBootstrap` lifecycle event of NestJS and try to call the `createIndex` API directly. You also need to turn off the auto index creation of mongoose.

## Considerations

1. You need to use the `Schema.index` API instead of defining the indexes in the `@Prop` decorator, this happens because we are not able give the index a name and it will be an auto generated one by the mongoose.
   - Make sure that you are following this guideline, otherwise your application won't be able to run.
2. DocumentDB has a max length on index name, so you cannot choose a really long name ([ref](https://docs.aws.amazon.com/documentdb/latest/developerguide/limits.html#limits-cluster)).
   - ≤ 127 characters.
3. We need to call `createCollection` API before trying to get index and or create them.
4. DocumentDB has another limitation, that is that we cannot create multiple indexes at the same time, so that is why I am getting all the defined indexes in the code and create them one after another for a given collection.
5. If you need to create an index on a field in a shared nested-document, you need to create it in the collection which is using the shared nested schema, similar to [users collection](./src/user/schemas/user.schema.ts).
