import {
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand, GetQueueUrlCommand } from '@aws-sdk/client-sqs';

import csv from 'csv-parser';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

const copyS3ObjectToFolder = async (bucket, key) => {
    const filename = path.basename(key);
    const copyDestination = `parsed/${filename}`;
    const copyObjectCommand = new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${key}`,
        Key: copyDestination,
    });
    await s3Client.send(copyObjectCommand);
};

const deleteS3Object = async (bucket, key) => {
    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    await s3Client.send(deleteObjectCommand);
};

const sendSQSEvent = (queueUrl, product) => {
    const sendMessageCommand = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(product),
    });
    sqsClient.send(sendMessageCommand);
};

export const handler = async (event, context, cb) => {
    console.log('event.Records: ', event.Records);

    try {
        const record = event.Records[0];
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        const getCSVobjectCommand = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const csvObject = await s3Client.send(getCSVobjectCommand);

        const getQueueUrlCommand = new GetQueueUrlCommand({
            QueueName: process.env.SQS_QUEUE_NAME,
        });


        const getUrlResponse = await sqsClient.send(getQueueUrlCommand);
        const queueUrl = getUrlResponse.QueueUrl;


        await new Promise((resolve, reject) => {
            csvObject.Body.pipe(csv())
                .on('data', (product) => sendSQSEvent(queueUrl, product))
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => reject(error));
        });

        await copyS3ObjectToFolder(bucket, key);
        await deleteS3Object(bucket, key);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Creation of product failed'),
        }
    }
};