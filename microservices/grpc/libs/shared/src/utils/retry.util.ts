/**
 * Retry-status object type, for use with RetryCallback.
 */
export type RetryStatus = {
  /**
   * Retry index, starting from 0.
   */
  index: number;
  /**
   * Retry overall duration, in milliseconds.
   */
  duration: number;
  /**
   * Last error, if available;
   * it is undefined only when "retryAsync" calls "func" with index = 0.
   */
  error?: any;
};

/**
 * Retry-status callback type.
 */
export type RetryCallback<T> = (s: RetryStatus) => T;

/**
 * Type for options passed into retryAsync function.
 */
export type RetryOptions = {
  /**
   * Maximum number of retries (infinite by default),
   * or a callback to indicate the need for another retry.
   */
  retry?: number | RetryCallback<boolean>;
  /**
   * Retry delays, in milliseconds (no delay by default),
   * or a callback that returns the delays.
   */
  delay?: number | RetryCallback<number>;
  /**
   * Error notifications.
   */
  error?: RetryCallback<void>;
};

/**
 * Retries async operation returned from "func" callback, according to "options".
 */

export function retryAsync<T>(
  func: RetryCallback<Promise<T>>,
  options?: RetryOptions,
): Promise<[Error | null, T | null]> {
  let index = 0;
  let error: unknown;
  let { retry = Number.POSITIVE_INFINITY } = options ?? {};
  const start = Date.now();
  const delay = options?.delay ?? -1;
  const retryStatus = () => ({
    index,
    duration: Date.now() - start,
    error: error,
  });
  const callbackFunction = (): Promise<[Error | null, T | null]> => {
    return func(retryStatus())
      .then((result) => [null, result] as [Error | null, T | null])
      .catch((caughtException) => {
        error = caughtException;

        if (typeof options?.error === 'function') {
          options?.error(retryStatus());
        }

        if (
          (typeof retry === 'function'
            ? retry(retryStatus())
              ? 1
              : 0
            : retry--) <= 0
        ) {
          return Promise.resolve([error as Error, null]);
        }

        const milliseconds =
          typeof delay === 'function' ? delay(retryStatus()) : delay;

        index++;

        if (milliseconds >= 0) {
          return new Promise((resolve) =>
            setTimeout(resolve, milliseconds),
          ).then(callbackFunction);
        }

        return callbackFunction();
      });
  };

  return callbackFunction();
}
