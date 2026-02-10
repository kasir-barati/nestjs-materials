export function urlBuilder(base: string, ...paths: string[]): string {
  base = base.replace(/\/+$/, '') + '/';

  const joinedPath = paths
    .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
    .filter((segment) => segment.length > 0)
    .join('/');

  return new URL(joinedPath, base).href;
}
