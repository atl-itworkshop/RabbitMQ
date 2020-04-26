const amqp = require('amqplib/callback_api')

console.log('\nHello, I am Consumer!!!\n')

// 1. connect to RabbitMQ
const urlLocal = 'amqp://localhost'
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
        channel.consume(queue, function(msg) {
            console.log(`Received message ${msg.content.toString()} from ${queue}`);
        }, {
            noAck: true     // broker does not expect acknowledgement from consumer
        });
    });
});
