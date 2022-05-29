# Get IP while your NestJS is behind Nginx

- Add one of the following lines in the nginx conf in the `location` scope, TBH IDK which one will work :joy:
  - `proxy_set_header X-Forwarded-For $remote_addr;`
  - `proxy_set_header X-Real-IP $remote_addr;`
- Example:

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    return request.ip || request.headers["x-forwarded-for"];
    // Or return request.ip || request.headers["X-Real-IP"];
  }
);
```
