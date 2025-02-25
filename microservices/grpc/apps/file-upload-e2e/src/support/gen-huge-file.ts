import { accessSync, createWriteStream, unlinkSync } from 'fs';
import { Readable } from 'stream';

/**
 * @description
 * Generate a large file to be uploaded. By default, it will generate a file of 10MB with the name `upload-me.txt`.
 */
export function generateLargeFile({
  sizeInMb = 10,
  filePath = 'upload-me.txt',
}: {
  sizeInMb?: number;
  filePath?: string;
}) {
  sizeInMb = sizeInMb * 1024 * 1024;

  deleteFileIfExists(filePath);

  return new Promise((resolve, reject) => {
    const stream = new Readable({
      read() {
        this.push('Lorem ipsum');

        if (--sizeInMb <= 0) {
          this.push(null);
        }
      },
    });
    const writable = createWriteStream(filePath);

    stream.pipe(writable);

    writable
      .on('finish', () => {
        resolve(null);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function deleteFileIfExists(filePath: string) {
  try {
    accessSync(filePath);
    unlinkSync(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File ${filePath} does not exist.`);
    }
  }
}
