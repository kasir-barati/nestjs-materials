const amqp = require('amqplib');
const { ObjectId } = require('bson');

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://guest:guest@rabbitmq:5672';
const QUEUE = process.env.QUEUE || 'demo.events';

async function waitForRabbit(url, retries = 20, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect(url);
      return conn;
    } catch (err) {
      console.log(`[publisher] RabbitMQ not ready (attempt ${i + 1}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Could not connect to RabbitMQ');
}

function buildEvent() {
  const userId = new ObjectId().toString();
  const orderId = new ObjectId();

  return {
    eventId: new ObjectId(),
    eventType: 'order.created',
    occurredAt: new Date(),
    payload: {
      orderId,
      user: {
        _id: userId,
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        address: {
          street: '221B Baker Street',
          city: 'London',
          country: 'UK',
        },
      },
      items: [
        { sku: 'SKU-001', qty: 2, price: 19.99, itemId: new ObjectId() },
        { sku: 'SKU-002', qty: 1, price: 49.5, itemId: new ObjectId() },
      ],
      totals: {
        subtotal: 89.48,
        tax: 7.16,
        grandTotal: 96.64,
        currency: 'EUR',
      },
    },
  };
}

// Custom serializer so ObjectId is preserved as EJSON-style {"$oid": "..."} in JSON.
// This is what most consumers (mongo, bson.EJSON) expect when passing ObjectId over JSON.
function serialize(event) {
  const { EJSON } = require('bson');
  return EJSON.stringify(event, { relaxed: false });
}

(async () => {
  const conn = await waitForRabbit(RABBIT_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`[publisher] Connected. Publishing to queue "${QUEUE}" every 3s. Ctrl+C to stop.`);

  const publishOne = () => {
    const event = buildEvent();
    const body = serialize(event);
    channel.sendToQueue(QUEUE, Buffer.from(body), {
      contentType: 'application/json',
      persistent: true,
      messageId: event.eventId.toString(),
      timestamp: Date.now(),
      headers: {
        'x-event-type': event.eventType,
      },
    });
    console.log('[publisher] Sent event:');
    console.log(body);
    console.log('---');
  };

  publishOne();
  setInterval(publishOne, 3000);
})().catch((err) => {
  console.error('[publisher] fatal:', err);
  process.exit(1);
});
