import { default as amqp } from 'amqplib';
import { ipcMain } from 'electron';
import './consumer';

let $connection: amqp.Connection | undefined;
let $channel1: amqp.Channel | undefined;
let $addTagToPrint: ((barcode?: string, name?: string, description?: string, type?: 'bin' | 'fixture' | 'item', notes?: string) => boolean) | undefined;

export const $$rabbitMQ = 'amqp://localhost';

ipcMain.on('add-to-tag-queue', (event: Electron.IpcMainEvent, name: string, barcode: string, description: string, type: any, notes: string) => {
    async function sendMsg() {
        try {
            const connection = await amqp.connect($$rabbitMQ);
            const channel = await connection.createChannel();
            const queue = await channel.assertQueue('print-tags', { durable: true });
            console.log(`messages in queue: ${queue.messageCount} consumers: ${queue.consumerCount}`);
            channel.sendToQueue(queue.queue, Buffer.from(JSON.stringify({ name, barcode, description, type, notes })), { persistent: true });
            console.log('sent', barcode);
            setTimeout(() => connection.close(), 2000);
        } catch (error) {
            console.error((error as any).name);
            console.error((error as any).message);
            throw error;
        }
    }
    console.log('received: add-to-tag-queue');
    sendMsg().then((x) => console.log('sendMsg done'));
});

// amqp.connect('amqp://localhost', function (error: Error | undefined, connection: amqp.Connection) {
//     if (error) throw error;
//     $connection = connection;
//     connection.createChannel(function (innerError: Error, channel: amqp.Channel) {
//         if (innerError) throw innerError;
//         $channel1 = channel;
//         const queue = 'print-tags';

//         channel.assertQueue(queue, { durable: true });

//         $addTagToPrint = (barcode?: string, name?: string, description?: string, type?: 'bin' | 'fixture' | 'item', notes?: string) => {
//             const msg = JSON.stringify({ barcode, type, description, name, notes });
//             return $channel1?.sendToQueue(queue, Buffer.from(msg), { persistent: true }) ?? false;
//         };
//     });
// }).then(() => {

// });

export { $addTagToPrint };
