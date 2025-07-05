export interface Class<Type> {
  new (...args: unknown[]): Type;
}
