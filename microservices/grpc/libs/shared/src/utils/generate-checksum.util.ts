import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import { checksums } from 'aws-crt';
import { createHash } from 'crypto';

/**
 * @todo
 * Implement CRC32CNVME.
 *
 * @description
 * Full object checksums in multipart uploads are only available for CRC-based checksums because they can linearize into a full object checksum.
 *
 * To generate a CRC32 checksum that matches AWS S3's, you need to encode the 32-bit integer directly as a 4-byte buffer in big-endian format before converting it to Base64.
 */
export function generateChecksum(
  content: string | Buffer,
  algorithm: ChecksumAlgorithm,
) {
  switch (algorithm) {
    case 'CRC32': {
      /**@description A 32-bit integer */
      const checksumNumber = checksums.crc32(content);

      /**@description Create a buffer and write the integer in big-endian format (most significant byte first) */
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32BE(checksumNumber, 0);

      /**@description Convert the 4-byte buffer to Base64 */
      return buffer.toString('base64');
    }
    case 'CRC32C': {
      /**@description A 32-bit integer */
      const crc32cChecksum = checksums.crc32c(content);

      /**@description Create a buffer and write the integer in big-endian format (most significant byte first) */
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32BE(crc32cChecksum, 0);

      /**@description Convert the 4-byte buffer to Base64 */
      return buffer.toString('base64');
    }
    case 'SHA1':
    case 'SHA256':
      return createHash(algorithm).update(content).digest('base64');
    default:
      throw 'Not implemented!';
  }
}
