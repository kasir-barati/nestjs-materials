export const TOPIC_EXCHANGE = 'amq.topic';

// Queue naming convention: <owner_name>.<queue_intent>
export const AUDIT_LOG_QUEUE = 'audit_log.logs';
export const DRIVER_VERIFICATION_REQ_QUEUE =
  'driver_api.verification_request';
export const DRIVER_VERIFICATION_RES_QUEUE =
  'verification_api.verification_response';
export const DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE =
  'driver_api.verification_request_compensate';

// Routing key convention: <entity>.<verb>
export const CREATED_ROUTING_KEY = '*.created';
export const UPDATED_ROUTING_KEY = '*.updated';
export const DELETED_ROUTING_KEY = '*.deleted';
export const DRIVER_CREATED_ROUTING_KEY = 'driver.created';
export const DRIVER_DELETED_ROUTING_KEY = 'driver.deleted';
export const DRIVER_UPDATED_ROUTING_KEY = 'driver.updated';
export const VERIFICATION_CREATED_ROUTING_KEY =
  'verification.created';
export const VERIFICATION_DELETED_ROUTING_KEY =
  'verification.deleted';
