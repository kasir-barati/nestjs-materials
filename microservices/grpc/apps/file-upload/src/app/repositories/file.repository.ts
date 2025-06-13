import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

interface File {
  id: string;
  filename: string;
  checksum: string;
  checksumAlgorithm: ChecksumAlgorithm;
}

@Injectable()
export class FileRepository {
  private files: File[] = [];

  create(file: File) {
    const duplicatedFileWithSameId = this.files.find(
      ({ id }) => id === file.id,
    );

    if (duplicatedFileWithSameId) {
      throw 'Duplicate ID';
    }

    this.files.push(file);
  }

  read(id: string) {
    const file = this.files.find((file) => file.id === id);

    if (!file) {
      throw 'File does not exists';
    }

    return file;
  }

  delete(id: string) {
    this.files = this.files.filter((file) => file.id === id);
  }
}
