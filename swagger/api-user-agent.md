# Make `user-agent` header optional in the swagger UI

```ts
import { ApiParam } from "@nestjs/swagger";

export const ApiUserAgent =
  (): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiParam({
      name: "User-Agent",
      required: false,
      description: "(Leave empty. browser send it automatically)",
      example:
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
    })(target, propertyKey, descriptor);
  };
```
