import { AttachedUserToTheRequest } from './attached-user-to-the-request.type';

export interface MicroservicesPayload {
  Authentication: string;
  user: AttachedUserToTheRequest;
}
