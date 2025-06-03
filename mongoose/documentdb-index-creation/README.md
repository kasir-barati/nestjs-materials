# DocumentDB Index Creation Automation

So the problem with DocumentDB is that it will not create the indexes we've defined in our NestJS/NodeJS app automatically unlike the MongoDB itself. To see the issue you can start the app and then try to open the [localhost:9002](http://localhost:9002):

```bash
docker compose up -d
```

The username and password for the mongo-express is "root" and "pass". Then you can open the `my-awesome-auto-index-db` database and go to `posts` collection, there you'll see all the indexes who have been created automatically.
