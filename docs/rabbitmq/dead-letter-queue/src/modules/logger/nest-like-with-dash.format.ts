import type { Format } from 'logform';

import { format } from 'winston';

/**
 * Custom Winston format that adds the " - " separator
 * before the timestamp to match NestJS's default logger format.
 */
export const nestLikeWithDashFormat: Format = format((info) => {
  // Add " - " before the timestamp to match NestJS format
  if (info.timestamp) {
    info.timestamp = ` - ${info.timestamp}`;
  }
  return info;
})();
