import { randomUUID } from 'crypto';

import { Chunk } from '../../../file-upload/src/assets/interfaces/file-upload.interface';
import { UploadStreamArguments } from './file-upload.type';

export async function uploadStream({
  checksum,
  callHandler,
  stream,
  fileTotalSize,
  checksumAlgorithm,
  fileName,
}: UploadStreamArguments) {
  let isFirstCall = true;
  let partNumber = 1;
  let bytesRead = 0;
  const fileId = randomUUID();

  // Act
  for await (const chunk of stream) {
    const data = Uint8Array.from(Buffer.from(chunk));
    let messagePayload: Chunk = {
      data,
      partNumber: partNumber++,
    };

    bytesRead += chunk.length;

    if (bytesRead === fileTotalSize) {
      messagePayload = {
        ...messagePayload,
        checksum,
      };
    }
    if (isFirstCall) {
      isFirstCall = false;
      messagePayload = {
        ...messagePayload,
        fileName,
        checksumAlgorithm,
        id: fileId,
        totalSize: fileTotalSize,
      };
    }

    callHandler.write(messagePayload, 'utf-8');
    if (bytesRead !== fileTotalSize) {
      await new Promise((resolve) => callHandler.on('data', resolve));
    }
  }

  // Close the stream to prevent failing test due to open streams.
  stream.close();

  return new Promise<void>((resolve, reject) => {
    callHandler
      .on('error', (error: Error) => {
        console.log('error?');
        if (error) {
          reject(error);
        }
      })
      .on('end', () => {
        console.log('end');
        resolve();
      })
      .on('close', () => {
        console.log('close');
        resolve();
      })
      .on('finish', () => {
        console.log('finish');
        resolve();
      });
  });
}
