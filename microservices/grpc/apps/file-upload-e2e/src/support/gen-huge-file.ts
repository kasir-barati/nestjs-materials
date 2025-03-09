import { accessSync, unlinkSync } from 'fs';
import { writeFile } from 'fs/promises';

/**
 * @description
 * Generate a large file to be uploaded. By default, it will generate a file of 10MB with the name `upload-me.txt`.
 */
export async function generateLargeFile({
  sizeInMb = 10,
  filePath = 'upload-me.txt',
}: {
  sizeInMb?: number;
  filePath?: string;
}) {
  sizeInMb = sizeInMb * 1024 * 1024;

  deleteFileIfExists(filePath);

  await writeFile(filePath, Buffer.alloc(sizeInMb, 'A'));
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
