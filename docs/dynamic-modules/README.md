# Dynamic Modules

To create a dynamic module we have two approaches:

## First Approach

- AKA [manual implementation](./manual-implementation/manual.module.ts).
- Needs a lot of boilerplate codes.

```ts
ManualModule.register({
  global: true,
  someOption: 123,
})

ManualModule.registerAsync({
  global: true,
  useFactory() {
    return {
      someOption: 123,
    }
  },
})

class ManualModuleOptions implements ManualModuleOptionsFactory {
  create() {
    return {
      someOption: 123,
    }
  }
}

ManualModule.registerAsync({
  global: true,
  useClass: ManualModuleOptions,
})
```

## Seconds Approach

> [!NOTE]
>
> A concrete example [`RedisModule`](./helper-class-implemtnation/redis-example/app.module.ts).

- A better way.
- My personal preference.
- Use [`ConfigurableModuleBuilder`](./helper-class-implemtnation/my.module.ts).
- Learn more about it in [the official documentation](https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder).

```ts
MyModule.register({
  global: true,
  someOption: 123,
  myExtra: 'extra-register',
})

MyModule.registerAsync({
  global: true,
  myExtra: 'extra-register-async-useFactory',
  useFactory() {
    return {
      someOption: 123,
    }
  },
})

class MyModuleOptions implements MyModuleOptionsFactory {
  create() {
    return {
      someOption: 123,
    }
  }
}

MyModule.registerAsync({
  global: true,
  myExtra: 'extra-register-async-useClass',
  useClass: MyModuleOptions,
})
```

> [!NOTE]
>
> - If you need to be able to inject extra options you need to define a new provider which provides exactly the extra options.
> - **NestJS's `ConfigurableModuleBuilder.setExtras()` has a design limitation**, it requires you to provide default values for **ALL** properties in the extras type, which makes them all effectively optional from TypeScript's perspective. So we need to make sure at runtime that we got all mandatory extra options:
>   ```ts
>   if (!myExtra) {
>     throw new Error('myExtra is required in MyModule options');
>   }
>   ```


## More examples

- [Pass the options from one module to a nested module (`ConfigurableModuleBuilder`)](https://github.com/kasir-barati/bugs/blob/028caf4819903d71a79cf2495659604483617317/src/mongo/mongo.module.ts).
