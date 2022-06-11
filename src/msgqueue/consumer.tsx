// consumer
import amqp from 'amqplib';
export const $$rabbitMQ = 'amqp://localhost';
import * as fs from 'graceful-fs';

import { ipcMain } from 'electron';
import { rembg } from './rembg';
import { mogrifyToPNG } from './mogrifyToPNG';
import { convertCSV } from './convertCSV';
import { appSettings } from '../settings';
import { ignore } from '../common/ignore';
import { APP_CONFIG } from '../config';
import { ObjectId } from 'bson';
import { photoRoot } from './photoRoot';
import { handlePayload } from './photoPipeline';

export const $$printTagsQueue = 'print-tags';

const log = (x: string) => process.stdout.write(`${x}\n`);

function surround(char: string) {
    return function (str?: string) {
        return [char, str ?? '', char].join('');
    };
}
async function consumePrintTags() {
    async function convertAndAppend(data: amqp.ConsumeMessage | null) {
        if (data == null) throw new Error('null data');
        const payload = JSON.parse(data.content.toString());
        if (!fs.existsSync(appSettings.files.printLabelsCSV)) {
            await fs.promises.appendFile(appSettings.files.printLabelsCSV, 'barcode,type,name,notes,description\n');
        }
        await fs.promises.appendFile(
            appSettings.files.printLabelsCSV,
            [
                surround('"')(payload.barcode),
                surround('"')(payload.type),
                surround('"')(payload.name),
                surround('"')(payload.notes),
                surround('"')(payload.description),
                '\n'
            ].join(',')
        );

        return data;
    }
    const connection = await amqp.connect($$rabbitMQ);
    const channel = await connection.createChannel();
    const asserted = await channel.assertQueue($$printTagsQueue);
    if (asserted.messageCount === 0) {
        log(`MESSAGE COUNT DONE`);

        await convertCSV();
        log('tags ready');
        log('Tags Ready');
    }
    await channel.prefetch(1);
    await channel.consume($$printTagsQueue, (x: amqp.ConsumeMessage | null) =>
        convertAndAppend(x)
            .then((x) => {
                setTimeout(() => channel.ack(x), 400);
                channel.checkQueue($$printTagsQueue).then((x) => {
                    x.messageCount === 0 ? convertCSV() : ignore();
                });
            })
            .catch(console.error)
    );
}

export type PhotoStage = 'upload' | 'convert' | 'removebg' | 'assign';

const itemRoot = (sku: string) => [APP_CONFIG.fs.path, 'items', sku, 'photos'].join('/');

ipcMain.on('consume-tags', consumePrintTags);
