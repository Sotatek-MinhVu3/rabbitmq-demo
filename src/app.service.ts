import { Injectable } from '@nestjs/common';
const amqp = require('amqplib/callback_api');

@Injectable()
export class AppService {
  getHello(): string {
    this.testRabbitmq();
    return 'Hello World!';
  }

  testRabbitmq() {
    amqp.connect(`amqp://localhost`, (err, connection) => {
      if (err) {
        throw err;
      }
      connection.createChannel((err, channel) => {
        if (err) throw err;
        let queueName = 'testRabbitmq';
        let message = 'Here is the test message!';
        channel.assertQueue(queueName, {
          durable: false,
        });
        channel.sendToQueue(queueName, Buffer.from(message));
      });
    });
  }
}
