const amqp = require('amqplib');
const { EJSON, ObjectId } = require('bson');

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://guest:guest@rabbitmq:5672';
const QUEUE = process.env.QUEUE || 'demo.events';

async function waitForRabbit(url, retries = 20, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect(url);
      return conn;
    } catch (err) {
      console.log(`[consumer] RabbitMQ not ready (attempt ${i + 1}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Could not connect to RabbitMQ');
}

(async () => {
  const conn = await waitForRabbit(RABBIT_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });
  await channel.prefetch(1);

  console.log(`[consumer] Waiting for messages on "${QUEUE}"...`);

  channel.consume(
    QUEUE,
    (msg) => {
      if (!msg) {
        return;
      }

      const raw = msg.content.toString();

      console.log('\n============================================');
      console.log('[consumer] RAW body (as it sits on the wire):');
      console.log(raw);
      console.log('============================================\n');

      channel.ack(msg);
    },
    { noAck: false }
  );
})().catch((err) => {
  console.error('[consumer] fatal:', err);
  process.exit(1);
});
