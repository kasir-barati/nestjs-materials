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
