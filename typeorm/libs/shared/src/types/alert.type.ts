import { SharedAlertType } from './alert-type.type';

export class SharedAlert {
  id: string;
  title: string;
  description: string;
  userId: string;
  alertTypeId: string | null;
  alertType: SharedAlertType | null;
  createdAt: Date;
  updatedAt: Date;
}
