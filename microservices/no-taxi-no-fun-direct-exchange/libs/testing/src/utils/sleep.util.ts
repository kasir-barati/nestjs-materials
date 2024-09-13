/** @param ms milliseconds -- default to 5 seconds */
export function sleep(ms: number = 5000) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, ms);
  });
}
