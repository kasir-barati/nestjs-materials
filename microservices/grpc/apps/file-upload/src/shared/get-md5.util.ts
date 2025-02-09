import { createHash } from 'crypto';
import { createReadStream } from 'fs';

/**
 * @description
 * The MD5 of a file's content, and NOT its name/path.
 * @returns
 * The digest value as a:
 * - String of hexadecimal digits (default).
 * - Bytes object.
 */
export async function getMd5(
  filePath: string,
  chunkSize: number,
  returnHex?: true,
): Promise<string>;
export async function getMd5(
  filePath: string,
  chunkSize: number,
  returnHex?: false,
): Promise<Buffer>;
export async function getMd5(
  filePath: string,
  chunkSize = 104857600,
  returnHex = true,
): Promise<string | Buffer> {
  const hash = createHash('md5');
  const stream = createReadStream(filePath, {
    highWaterMark: chunkSize,
  });

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return returnHex ? hash.digest('hex') : hash.digest();
}
