export interface MailCatcherMessage {
  /**@example 1 */
  id: number;
  /**@example <no-reply@complex-reservation.com> */
  sender: string;
  /**@example '<game@life.pi>' */
  recipients: string[];
  /**@example 'Complex reservation notification' */
  subject: string;
  /**@example '398' */
  size: string;
  /**@example '2024-08-27T16:30:58+00:00' */
  created_at: string;
}
