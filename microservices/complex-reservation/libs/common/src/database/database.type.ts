import { Types } from 'mongoose';

export interface DatabaseConfig {
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
}
export interface Pagination<Document> {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
  data: Document[];
}
export class MongoError {
  public code: number;
  public message: string;
  public keyValue: Record<string, unknown>;
  public name: string | 'MongoError';
}
export class DuplicationError extends Error {
  constructor(
    public readonly field: string,
    public readonly message: string,
  ) {
    super(message);
  }
}
export interface PartialId {
  _id?: Types.ObjectId;
}
