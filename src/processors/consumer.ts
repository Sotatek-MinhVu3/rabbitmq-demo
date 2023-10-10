import { NestFactory } from '@nestjs/core';
import { Injectable, Module } from '@nestjs/common';

const amqp = require('amqplib/callback_api');

@Injectable()
export class QueueConsumer {}

@Module({
  imports: [],
  providers: [],
  exports: [],
})
class ConsumerModule {
  constructor() {
    amqp.connect(`amqp://localhost`, (err, connection) => {
      if (err) {
        throw err;
      }
      connection.createChannel((err, channel) => {
        if (err) throw err;
        let queueName = 'testRabbitmq';
        channel.assertQueue(queueName, {
          durable: false,
        });
        channel.consume(queueName, (msg) => {
          console.log(`Received message: ${msg.content.toString()}`);
          channel.ack(msg);
        });
      });
    });
  }
}

const run = async () => {
  const consumer = await NestFactory.create(ConsumerModule);
  await consumer.init();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
