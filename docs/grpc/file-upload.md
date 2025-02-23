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

Learn how to do it [here](https://github.com/kasir-barati/cloud/blob/f6de8bb963f4a2c68632a83bef340772c39c087e/aws/S3/multipart-file-upload.md).

And for a complete example take a look at `nestjs-materials/microservices/grpc/file-upload` NestJS app.
