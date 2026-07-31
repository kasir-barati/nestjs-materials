## How to Get All the Endpoints of a REST API

The is for when you use [`@nestjs/testing`](https://www.npmjs.com/package/@nestjs/testing).

```ts
console.log(
  this.app
    .getHttpServer()
    ._events.request._router.stack.filter((r: any) => r.route)
    .map((r: any) => {
      return {
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: r.route.path,
      }
    })
)
```
