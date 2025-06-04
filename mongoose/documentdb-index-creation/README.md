# DocumentDB Index Creation Automation

So the problem with DocumentDB is that it will not create the indexes we've defined in our NestJS/NodeJS app automatically unlike the MongoDB itself. To see the issue you can start by checking out to [this commit sha](https://github.com/kasir-barati/nestjs-materials/tree/21c9227a2c2e5b114fd0edefa7146a55afc1d1c0/microservices/grpc/apps/file-upload/src/app) app and then try start the app and then opening the [localhost:9002](http://localhost:9002) in your browser:

```bash
docker compose up -d
```

The username and password for the mongo-express is "root" and "pass". Then you can open the `my-awesome-auto-index-db` database and go to `posts` collection, there you'll see all the indexes who have been created automatically.
