# Dependency Injection (DI)

- Inversion of Control (IoC).

## `type-only` Imports

- When you import a module as a [type-only import](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html), Nest **CANNOT** resolve the runtime token.
- [Example](https://github.com/kasir-barati/bugs/tree/nestjs-type-only-dependency-injection?tab=readme-ov-file#type-only-import).