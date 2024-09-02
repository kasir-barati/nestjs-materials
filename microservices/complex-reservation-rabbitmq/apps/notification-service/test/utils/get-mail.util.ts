import axios from 'axios';

interface Message {
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

/**@param email recipient email address. */
export async function getMail(email: string): Promise<Message> {
  const { data: messages } = await axios.get<Message[]>(
    'http://localhost:1080/messages',
  );

  for (const message of messages) {
    if (message.recipients.includes(`<${email}>`)) {
      return message;
    }
  }
}
