# Complex Reservation

In this project we will write E2E tests, automating our tests and unit tests. To learn more about tests. Learn more about testing [here](https://github.com/kasir-barati/awesome-js-ts/blob/main/.github/docs/testing.md). I also tried to have idempotent endpoints but it is rather cumbersome with NestJS and how it works. Just look at how I had to change the response status code [here](https://github.com/kasir-barati/nestjs-materials/blob/3b6995942f88765155dfb9eb79b54ca88aa98658/microservices/complex-reservation/apps/reservation-service/src/reservation/reservation.controller.ts#L132) or how much effort I had to put into detecting whether [this is a new document or should I update the existing one](https://github.com/kasir-barati/nestjs-materials/blob/3b6995942f88765155dfb9eb79b54ca88aa98658/microservices/complex-reservation/apps/reservation-service/src/reservation/reservation.service.ts#L37-L111). It worth mentioning it that your everyday class-validator sucks at validating the incoming request. as you can see that I eventually had to do part of it in the service layer [here](https://github.com/kasir-barati/nestjs-materials/blob/3b6995942f88765155dfb9eb79b54ca88aa98658/microservices/complex-reservation/apps/reservation-service/src/reservation/reservation.service.ts#L55) and [here](https://github.com/kasir-barati/nestjs-materials/blob/3b6995942f88765155dfb9eb79b54ca88aa98658/microservices/complex-reservation/apps/reservation-service/src/reservation/reservation.service.ts#L66). So all in all if I wanna be completely honest I would say it is too much effort. Just compare it to what I did for [creating user](https://github.com/kasir-barati/nestjs-materials/blob/3b6995942f88765155dfb9eb79b54ca88aa98658/microservices/complex-reservation/apps/auth-service/src/user/user.controller.ts#L51), the difference is palpable.

**BUT** This does not mean that I am advocating against it since now my reservation service is idempotent and our client app can repeat just about anything when their initial request failed. Of course there are still features such as adding [`retry-after` header](../../.github/docs/designing-restful-api/README.md#retryAfter) to the response. I wanna emphasis on the fact that if you're building an app for a very critical thing (things like financial apps, hospitals) where you need to be fail tolerant you probably need to consider it.

A reservation booking system that has the following features:

- Payment.
- Bill users.
- Persist reservations.
- Send email notifications.

  - In dev env you can see them by going to this url: http://localhost:1080/.
  - Right now we ain't re-authenticating user in the notification service, though you might wanna do or do not do it:

    | Do it                                                                                           | Do not do it                                                                              |
    | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
    | **Security Sensitivity**: E.g trigger financial transactions or access to sensitive data.       | **Trust Between Services**: Microservices often operate within a trusted network.         |
    | **Different Security Context**: E.g. stricter requirements and regulations.                     | **Separation of Concerns**: You could argue that it is not notification's responsibility. |
    | There is **significant time gap** between the initial authentication & notification being sent. | **Performance Considerations**: too much load on auth service.                            |

## Topics that can be considered for further discussion

- CI/CD.
- [Shared database VS separate database](https://youtu.be/mBNDxpJTg8U?t=285).
- Create client SDK for your microservices.
- Retry mechanism for even-driven communication.
- Which microservice can access another microservice and to which extend.

## Learn more

- [My own documentation as an introductory info for microservices](https://github.com/kasir-barati/you-say/blob/main/.github/docs/microservices/README.md).
- [PATCH vs PUT HTTP verb](https://dev.to/kasir-barati/patch-vs-put-2pa3).
- [The concept of machine-2-machine communication and as such permissions](https://www.reddit.com/r/microservices/comments/16kpc6z/authentication_and_authorization_between_internal).
- RESTful API and idempotency [here](../../.github/docs/designing-restful-api/README.md), and here(https://github.com/kasir-barati/you-say/tree/main/.github/docs/REST).

## Start the app in dev env

1. `pnpm i --frozen-lockfile	`
2. Copy `.env.example` files and create `.env` files.
3. `pnpm compose:up`.
4. `pnpm start`.

## Run E2E tests

1. `cp .env.example .env`
2. `pnpm i --frozen-lockfile`
3. `./run-e2e.sh`

### Update 3rd-party libs

`pnpm up --latest`

## Tech stack

- [JWT](https://jwt.io/).
- [Jest](https://jestjs.io/).
- [NestJS](https://nestjs.com/).
- [Docker](https://www.docker.com/).
- [MongoDB](https://www.mongodb.com/).
- [Mongoose](https://mongoosejs.com/).
- [Docker compose](https://docs.docker.com/compose/).
<!-- - [FusionAuth](https://fusionauth.io/). -->

## Services

- Payment.
- Reservation.
- Notification.

## Libs

Common libraries that we'll use in different microservices.
