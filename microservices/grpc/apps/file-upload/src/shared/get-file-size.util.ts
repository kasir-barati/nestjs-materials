import { stat } from 'fs/promises';

export async function getFileSize(filePath: string): Promise<number> {
  const stats = await stat(filePath);

  return stats.size;
}
