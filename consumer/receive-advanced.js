// NOTE: Make sure that Broker has a queue named my-queue-0 before running this program.
//          Queue my-queue-0 can be created by running the send.js program (if not already run)

const amqp = require('amqplib/callback_api')

console.log('\nHello, I am Consumer!!!\n')

const urlLocal = "amqp://localhost"
const urlCloud = "amqp://fscoyrrw:zhPrA529SyNI5biGVa9NkuC-mmpRC5d-@toad.rmq.cloudamqp.com/fscoyrrw"

// NEW CONCEPTS:
//  1. prefetch
//  2. ack

// 1. connect to RabbitMQ
amqp.connect(urlLocal, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // 2. create Channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // 3. create Q
        var queue = 'my-queue-0';
        channel.assertQueue(queue, {
            durable: false
        });

        console.log(`\n Waiting for messages in ${queue}. To exit press CTRL+C...\n`);

        // 4. read msg from Q
        channel.prefetch(1);            // read only 1 message at a time from the queue

        channel.consume(queue, function(msg) {
            console.log(`Received message ${msg.content.toString()} from ${queue}. Waiting to process message...`);

            //msg takes 10 secs to process
            setTimeout(function() {
                console.log(`Done processing msg: ${msg.content.toString()}\n`)
                channel.ack(msg);       // send acknowledgement for msg to the broker
            }, 10000);
        }, {
            noAck: false                // broker expects acknowledgement from consumer after receiving the message
        });
    });
});
