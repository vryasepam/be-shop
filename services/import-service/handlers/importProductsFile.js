import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const handler = async (event, context, cb) => {
  const { name } = event.queryStringParameters;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    ContentType: 'text/csv',
    Key: `uploaded/${name}`,
  };

  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand(params), {
    expiresIn: 60,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(signedUrl),
  };
};
