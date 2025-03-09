# gRPC

## File Upload

> [!NOTE]
>
> - This file upload only works when each chunk is bigger than 5MB, meaning you need to use a file bigger than 5MB.
> - You can add retry logic to your client side to try to upload a failing chunk again.
> - You **MUST** send the algorithm you'll use to calculate the checksum of the file with the first message.
> - You **MUST** send the checksum of the file with the last message.

1. `cd microservices/grpc`.
2. `pnpm i --frozen-lockfile`.
3. `cp apps/file-upload/.env.example apps/file-upload/.env`.
4. `nx serve file-upload`.
5. `nx e2e file-upload-e2e`.`

## Solved issues

<details>
<summary><code>Error: 8 RESOURCE_EXHAUSTED: Received message larger than max (5242952 vs 4194304)</code></summary>

```bash
Error: 8 RESOURCE_EXHAUSTED: Received message larger than max (5242952 vs 4194304)
    at callErrorFromStatus (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/@grpc+grpc-js@1.12.5/node_modules/@grpc/grpc-js/src/call.ts:82:17)
    at Object.onReceiveStatus (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/@grpc+grpc-js@1.12.5/node_modules/@grpc/grpc-js/src/client.ts:706:51)
    at Object.onReceiveStatus (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/@grpc+grpc-js@1.12.5/node_modules/@grpc/grpc-js/src/client-interceptors.ts:419:48)
    at /home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/@grpc+grpc-js@1.12.5/node_modules/@grpc/grpc-js/src/resolving-call.ts:163:24
    at processTicksAndRejections (node:internal/process/task_queues:85:11)
for call at
    at ServiceClientImpl.makeBidiStreamRequest (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/@grpc+grpc-js@1.12.5/node_modules/@grpc/grpc-js/src/client.ts:690:42)
    at ServiceClientImpl.<anonymous> (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/@grpc+grpc-js@1.12.5/node_modules/@grpc/grpc-js/src/make-client.ts:189:15)
    at /home/kasir/projects/nestjs-materials/microservices/grpc/apps/file-upload-e2e/src/file-upload/file-upload.spec.ts:122:32
    at Generator.next (<anonymous>)
    at /home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.js:170:75
    at new Promise (<anonymous>)
    at Object.__awaiter (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.js:166:16)
    at Object.<anonymous> (/home/kasir/projects/nestjs-materials/microservices/grpc/apps/file-upload-e2e/src/file-upload/file-upload.spec.ts:119:48)
    at Promise.then.completed (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/run.js:316:40)
    at async _runTest (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/run.js:252:3)
    at async _runTestsForDescribeBlock (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/run.js:126:9)
    at async _runTestsForDescribeBlock (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/run.js:121:9)
    at async run (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/run.js:71:3)
    at async runAndTransformResultsToJestFormat (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at async jestAdapter (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-circus@29.7.0_babel-plugin-macros@3.1.0/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at async runTestInternal (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-runner@29.7.0/node_modules/jest-runner/build/runTest.js:367:16)
    at async runTest (/home/kasir/projects/nestjs-materials/microservices/grpc/node_modules/.pnpm/jest-runner@29.7.0/node_modules/jest-runner/build/runTest.js:444:34) {
  code: 8,
  details: 'Received message larger than max (5242952 vs 4194304)',
  metadata: Metadata {
    internalRepr: Map(2) { 'content-type' => [Array], 'date' => [Array] },
    options: {}
  }
}
```

Solution: [https://stackoverflow.com/a/79426630/8784518](https://stackoverflow.com/a/79426630/8784518).

</details>

<details>
<summary><code>InvalidPart: One or more of the specified parts could not be found.  The part may not have been uploaded, or the specified entity tag may not match the part's entity tag</code></summary>

I event opened this issue for the [`@aws-sdk/client-s3`](https://github.com/aws/aws-sdk-js-v3/issues/6900) :sweat_smile:.

So this issue was cause because I was not adding the returned checksum from the `UploadPartCommand` to the `this.parts` array [here](https://github.com/kasir-barati/nestjs-materials/blob/8a17566e02988c349627addee4c71035acf64a12/microservices/grpc/apps/file-upload/src/app/services/file.service.ts#L62-L70). And when I added it it was working again.

</details>
