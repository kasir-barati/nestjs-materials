# Axios Error → GraphQL Sandbox

NestJS cannot map Axios errors to HTTP exceptions automatically, so we have to do this manually. Here we have a minimal NestJS + Apollo GraphQL app that calls an upstream REST API mocked by WireMock. The upstream returns four different status codes on four different endpoints:

| Endpoint       | Method | Upstream status | Payload                                                     |
| -------------- | ------ | --------------- | ----------------------------------------------------------- |
| `/forbidden`   | GET    | 403             | `{ statusCode: 403, error: "Forbidden", message: "..." }`   |
| `/not-found`   | GET    | 404             | `{ statusCode: 404, error: "Not Found", message: "..." }`   |
| `/bad-request` | POST   | 400             | `{ statusCode: 400, error: "Bad Request", message: [...] }` |
| `/conflict`    | POST   | 409             | `{ statusCode: 409, error: "Conflict", message: "..." }`    |

The NestJS service (`src/user.service.ts`) deliberately does NOT handle Axios errors. Each method just calls `firstValueFrom(this.http.get/post(...))` and returns the data. When upstream fails, the underlying `AxiosError` propagates unhandled through the resolver.

## Running

```bash
cd /home/mjb/projects/agentic_vision_2/axios-error-sandbox
docker compose up --build -d
```

- WireMock: http://localhost:8080
- GraphQL: http://localhost:3000/graphql

## The 4 Scenarios

Open http://localhost:3000/graphql in a browser (Apollo Sandbox loads automatically) and run:

```graphql
# Upstream 403
query {
  userForbiddenQuery {
    ok
    payload
  }
}

# Upstream 404
query {
  userNotFoundQuery(id: "507f1f77bcf86cd799439011") {
    ok
    payload
  }
}

# Upstream 400
mutation {
  userBadRequestMutation(name: "leak-detector") {
    ok
    payload
  }
}

# Upstream 409
mutation {
  userConflictMutation(name: "leak-detector") {
    ok
    payload
  }
}
```

## What to look for in each response

For each of the four calls, inspect:

- `errors[].message` — is the upstream message preserved, or does it become a generic `"Internal server error"`?
- `errors[].extensions.code` — is it `BAD_USER_INPUT`, `FORBIDDEN`, `NOT_FOUND`, etc., or an opaque `INTERNAL_SERVER_ERROR`?
- `errors[].extensions.originalError.statusCode` — does the HTTP status leak through, or is everything flattened to 500?
- HTTP response status of the GraphQL endpoint itself returns 200 for field-level errors regardless of upstream status.

## `userMappedForbiddenQuery`

This one uses a helper function to map Axios errors.
