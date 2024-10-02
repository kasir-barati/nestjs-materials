export function getLevel() {
  return process.env.NODE_ENV !== 'production' ? 'debug' : 'info';
}
