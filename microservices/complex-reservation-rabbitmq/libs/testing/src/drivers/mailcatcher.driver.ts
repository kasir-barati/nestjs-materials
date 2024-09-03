import axios from 'axios';
import { MailCatcherMessage } from '../types/mailcatcher-message.type';

export class MailCatcherDriver {
  /**@param email recipient email address. */
  async getMail(email: string): Promise<MailCatcherMessage> {
    const { data: messages } = await axios.get<MailCatcherMessage[]>(
      'http://localhost:1080/messages',
    );

    for (const message of messages) {
      if (message.recipients.includes(`<${email}>`)) {
        return message;
      }
    }
  }
}
