# gRPC

## File Upload

1. `cd microservices/grpc`.
2. `pnpm i --frozen-lockfile`.
3. `cp apps/file-upload/.env.example apps/file-upload/.env`.
4. `nx serve file-upload`.
5. `nx e2e file-upload-e2e`.`

```bash
InvalidPart: One or more of the specified parts could not be found.  The part may not have been uploaded, or the specified entity tag may not match the part's entity tag.
```

https://github.com/aws/aws-sdk-js-v3/issues/6900

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
