# DTOs

With class-transformeer we can rename a field like this: 

```ts
class Person {
  @Expose({name: 'age_of_user' })
  age: number
}
```

Now we can invoke the API with this: `{ age_of_user: 13 }` but in your code you can access it like: `pperson.age` instead of `person.age_of_user`.
