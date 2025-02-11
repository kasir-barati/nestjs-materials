export interface GrpcErrorResponse {
  code: number;
  details: string;
  metadata: {
    internalRepr: unknown;
    options: Record<string, unknown>;
  };
}
