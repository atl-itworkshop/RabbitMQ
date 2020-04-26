const amqp = require('amqplib/callback_api')

console.log('\nHello, I am Publisher!!!\n')

const urlLocal = "amqp://localhost"
const urlCloud = "amqp://fscoyrrw:zhPrA529SyNI5biGVa9NkuC-mmpRC5d-@toad.rmq.cloudamqp.com/fscoyrrw"

// NEW CONCEPTS:
//  1. named exchange
//  2. two queues on one exchange
//  3. binding key
//  4. routing key
//  5. queue arguments

// 1. connect to RabbitMQ
amqp.connect(urlLocal, function(error1, connection) {
    if (error1) {
        throw error1;
    }

    // 2. create Channel
    connection.createChannel(function(error2, channel) {
        if (error2) {
            throw error2;
        }

        // 3a. create Exchange
        var exchange = "my-exchange-adv";
        channel.assertExchange(exchange, 'direct', {durable: true, autoDelete: false})

        
        // 3b. create Q1
        var queue1 = 'my-queue-adv-1';
        var queueArguments = {}
        queueArguments['x-message-ttl'] = 30000     // milliseconds
        var bindingKey = 'my-queue-adv-1'

        channel.assertQueue(queue1, {durable: true, autoDelete: false, arguments: queueArguments}, function(error3, createdQueue) {
            if (error3) {
                throw error3
            }
            // 3c. bind Q to Exchange
            channel.bindQueue(createdQueue.queue, exchange, bindingKey, null, function (error4, ok) {
                if (error4) {
                    throw error4
                }

                // 4. send msg to Q
                var msg = 'Hello World from Advanced Queue 1!';
                var routingKey = 'my-queue-adv-1'
                channel.publish(exchange, routingKey, Buffer.from(msg), {persistent: true});
        
                console.log(`Send message ${msg} to queue ${queue1}`);
            })
        });

        // 3b. create Q2
        var queue2 = 'my-queue-adv-2';
        var queueArguments2 = {}
        queueArguments2['x-message-ttl'] = 60000  // milliseconds
        var bindingKey2 = 'my-queue-adv-2'

        channel.assertQueue(queue2, {durable: true, autoDelete: false, arguments: queueArguments2}, function(error3, createdQueue) {
            if (error3) {
                throw error3
            }
            // 3c. bind Q to Exchange
            channel.bindQueue(createdQueue.queue, exchange, bindingKey2, null, function (error4, ok) {
                if (error4) {
                    throw error4
                }

                // 4. send msg to Q
                var msg = 'Hello World from Advanced queue-2!';
                var routingKey2 = 'my-queue-adv-2'
                channel.publish(exchange, routingKey2, Buffer.from(msg), {persistent: true});
        
                console.log(`Send message ${msg} to queue ${queue2}`);
            })
        });
        
    });

    // 5. close conn (after 500 milliseconds)
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
