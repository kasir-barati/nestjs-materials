# Decorators

- Assume you have a lot of optional fields in your DTO and you wanna make sure that at least one of them were sent by the client, [here](./any-of/any-of.decorator.ts) is how you can do it.
- Assume you wanna enforce that client can only send one of the fields in your DTO and not both of them at the same time, [here](./one-of/one-of.decorator.ts) is how you can do it.
