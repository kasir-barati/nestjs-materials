# When using a json in your env you should consider parsing it into an object manually

You can do this by adding `Transform` also set `forbidUnknownValues` as `false`. And while NestJS have builtin parser from JSON to plain JS object when request comes from API (via controller), but our env loader does have that. So we need to take care of that ourselves.

**[Reference](https://github.com/typestack/class-transformer/issues/1519)**
