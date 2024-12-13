import { IncomingHttpHeaders } from 'http';

/**
 * @description
 * Normalizes the incoming case-insensitive request headers.
 *
 * @link https://stackoverflow.com/a/41169947/8784518
 */
export function headerNormalizer(headers: IncomingHttpHeaders) {
  const normalizedHeaders: IncomingHttpHeaders = {};

  for (const [header, headerValue] of Object.entries(headers)) {
    normalizedHeaders[header.toLowerCase()] = headerValue;
  }

  return normalizedHeaders;
}
