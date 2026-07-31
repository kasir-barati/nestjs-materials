## How to Get All the Endpoints of a REST API

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
