import { SharedAlert } from './alert.type';

export interface SharedAlertType {
  id: string;
  name: string;
  description: string;
  alerts: SharedAlert[];
  createdAt: Date;
  updatedAt: Date;
}
