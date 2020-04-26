const amqp = require('amqplib/callback_api')

console.log('\nHello, I am Publisher!!!\n')

// 1. connect to RabbitMQ
const urlLocal = "amqp://localhost"
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

        // 4. send msg to Q
        var msg = 'Hello World - 1!';
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(`Send message ${msg} to queue ${queue}`);
    });

    // 5. close conn (after 500 milliseconds)
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
