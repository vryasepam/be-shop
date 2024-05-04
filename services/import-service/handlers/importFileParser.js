import {
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';
import csv from 'csv-parser';

const s3Client = new S3Client({ region: 'us-east-1' });

export const handler = async (event, context, cb) => {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await s3Client.send(getObjectCommand);

    const filename = path.basename(key);
    const copyDestination = `parsed/${filename}`;

    const copyObjectCommand = new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${key}`,
        Key: copyDestination,
    });

    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    await new Promise((resolve, reject) => {
        response.Body.pipe(csv())
            .on('data', (data) => {
                console.info('data: ', data);
            })
            .on('end', () => {
                resolve();
            })
            .on('error', (error) => reject(error));
    });

    await Promise.all([s3Client.send(copyObjectCommand), s3Client.send(deleteObjectCommand)])

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    };
};