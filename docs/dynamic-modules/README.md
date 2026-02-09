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

- A better way.
- My personal preference.
- Use [`ConfigurableModuleBuilder`](./helper-class-implemtnation/my.module.ts).
- Learn more about it in [the official documentation](https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder).

```ts
MyModule.register({
  global: true,
  someOption: 123,
})

MyModule.registerAsync({
  global: true,
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
  useClass: MyModuleOptions,
})
```

## More examples

- [Pass the options from one module to a nested module (`ConfigurableModuleBuilder`)](https://github.com/kasir-barati/bugs/blob/028caf4819903d71a79cf2495659604483617317/src/mongo/mongo.module.ts).
