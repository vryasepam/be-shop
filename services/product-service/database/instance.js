import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const createDynamoDbInstance = () => {
    const isOfflineSetup = process.env.IS_OFFLINE === 'true';

    if (isOfflineSetup) {
        return new DynamoDBClient({
          region: "localhost",
          endpoint: "http://localhost:8000",
          credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
          }
        });
      }

      return new DynamoDBClient({ region: process.env.AWS_REGION });
}

const dynamodbClient = DynamoDBDocumentClient.from(createDynamoDbInstance());

export default dynamodbClient; 
