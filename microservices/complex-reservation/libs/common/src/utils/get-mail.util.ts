import axios from 'axios';

export interface Message {
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

export function getMail(
  email: string,
  timeout: number = 3_000,
): Promise<Message> {
  const startTime = Date.now();

  return new Promise((resolve, _) => {
    const attempt = () => {
      if (isTimeoutReached(timeout, startTime)) {
        resolve(undefined);
      }

      getMessage(email).then((message) => {
        if (!message) {
          setTimeout(attempt, 500);
        } else {
          resolve(message);
        }
      });
    };

    attempt();
  });
}

function isTimeoutReached(timeout: number, startTime: number) {
  return Date.now() >= startTime + timeout;
}
async function getMessage(email: string) {
  const messages = await getMessages();

  for (const message of messages) {
    if (message.recipients.includes(`<${email}>`)) {
      return message;
    }
  }
}

async function getMessages() {
  const { data } = await axios.get<Message[]>(
    'http://localhost:1080/messages',
  );

  return data;
}
