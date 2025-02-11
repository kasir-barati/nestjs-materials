# Streams in NodeJS

> [!NOTE]
>
> Writing this since I got a memory leak in my streaming gRPC file upload API.

## Categories

- **Writable**: streams to which data can be written (e.g. `fs.createWriteStream()`).
- **Readable**: streams from which data can be read (e.g. `fs.createReadStream()`).
- **Duplex**: streams that are both `Readable` and `Writable` (e.g. `net.Socket`).
- **Transform**: Duplex streams that can modify or transform the data as it is written and read
  (e.g. `zlib.createDeflate()`).

## `PassThrough`

- A trivial implementation of a `Transform` stream.
- Passes the input bytes across to the output.
  > [!TIP]
  >
  > Postman does something really weird;
  >
  > - You have a validator for the incoming messages over the stream,
  > - Your code throws an error and sending it back to the client (`subject,error(...)`).
  > - Then if you send an invalid message it will close the stream and your stream will stay open for as
  >   long as the app is running and have not faced a memory leak error.
  >   [!CAUTION]
  >
  > You should not have any resources associated with an entire connection (gRPC connections).
  > **Even** if you identify your clients somehow and allocate a resource to that client, because,
  > **there's no guarantee that all ongoing calls from that client use the same connection**.

# Solution

Do it manually 🥲

1. A CreateMultipartUpload call to start the process.

- **General doc**: [CreateMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API
  API_CreateMultipartUpload.html).
- **JS SDK doc**: [CreateMultipartUploadCommand](https://docs.aws.amazon.com
  AWSJavaScriptSDK/v3/latest/client/s3/command/CreateMultipartUploadCommand/).

2. As many individual UploadPart calls as needed.- **General doc**: [UploadPart](https://docs.aws.amazon.com/AmazonS3/latest/API
   API_UploadPart.html).

- **JS SDK doc**: [UploadPartCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3
  latest/client/s3/command/UploadPartCommand/).

3. A CompleteMultipartUpload call to complete the process.

- **General doc**: [CompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest
  API/API_CompleteMultipartUpload.html).
- **JS SDK doc**: [CompleteMultipartUploadCommand](https://docs.aws.amazon.com
  AWSJavaScriptSDK/v3/latest/client/s3/command/CompleteMultipartUploadCommand/).

## CreateMultipartUploadCommand

- **This is the first step**.
- Initiates a multipart upload.
- Returns an upload ID.
- Used to associate all of the parts in the specific multipart upload.
- With each UploadPartCommand we will send this ID.
- Used to complete or abort the multipart upload request.
- To stop being charged for storing the uploaded parts, you must either complete or abort the
  multipart upload.
  > [!NOTE]
  >
  > We can have aborting incomplete multipart uploads using a bucket lifecycle configuration
  > ([learn more here](https://docs.aws.amazon.com/AmazonS3/latest/userguide
  > mpuoverview.html#mpu-abort-incomplete-mpu-lifecycle-config)).

```ts
/**
 *
 * @returns upload ID. We'll use this ID to associate all of the parts in the specific multipart upload.
 */
async function createMultipartUpload(
  bucketName: string,
  key: string,
  checksumAlgorithm: ChecksumAlgorithm
): Promise<string> {
  const command = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    ChecksumAlgorithm: checksumAlgorithm,
  });
  const response = await this.s3Client.send(command);
  if (!response.UploadId) {
    throw new InternalServerErrorException("UploadId is missing");
  }
  return response.UploadId;
}
```

## Call UploadPartCommand n Times

- Provide new data as a part of an object in your request.
- We **SHOULD** pass a part number with each request.
- Any number from 1 to 10,000, inclusive.
- It indicates the part's position within the object which will be eventually created if we complete
  the multipart upload.
- AWS will overwrite the part if the part number has already been uploaded for that upload ID.
- Each par should not exceed the amount specified by the AWS S3 max part size ([ref](https:/
  docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html)).

```ts
async function uploadPart(
  bucketName: string,
  key: string,
  uploadId: string,
  chunkPart: number,
  data: Uint8Array
) {
  const command = new UploadPartCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    PartNumber: chunkPart,
    Body: data,
  });
  const response = await this.s3Client.send(command);
  return response.ETag;
}
```

## CompleteMultipartUploadCommand or AbortMultipartUploadCommand

```ts
async function completeMultipartUpload(
  bucketName: string,
  key: string,
  uploadId: string
) {
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
  });
  const response = await this.s3Client.send(command);
  return response.ETag;
}
async function abortUpload(bucketName: string, key: string, uploadId: string) {
  const command = new AbortMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
  });
  await this.s3Client.send(command);
}
```
