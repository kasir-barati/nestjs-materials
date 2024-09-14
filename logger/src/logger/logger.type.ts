export interface SerializedRequest {
  id: string;
  url: string;
  body: unknown;
  query: Record<string, string>;
  params: Record<string, string>;
  method: string;
  headers: Record<string, string>;
  remotePort: number;
  remoteAddress: string;
}

export interface SerializedResponse {
  id: string;
  statusCode: number;
  headers: Record<string, string>;
  responseTime: number;
}
