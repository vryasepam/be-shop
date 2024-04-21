import AWS from "aws-sdk";
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

import products from "./seedData/products.json";
import stocks from "./seedData/stocks.json";

const dynamodbClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  async function seedTable(tableName, items) {
    try {
        for (const item of items) {
            const params = {
                TableName: tableName,
                Item: item,
            };

            await dynamodbClient.send(new PutItemCommand(params));
            console.log(`Item seeded successfully.`);
        }
    } catch (error) {
        console.error('Error seeding table:', error);
    }
}


seedTable(products, 'products');
seedTable(stocks, 'stocks');
