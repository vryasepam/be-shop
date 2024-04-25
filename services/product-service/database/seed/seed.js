import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import products from './products.json';
import stocks from './stocks.json';

const dynamodbClient = new DynamoDBClient({
    region: 'us-east-1'
});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

async function seedTable(items, tableName) {
    for (const item of items) {

        const command = new PutCommand({
            TableName: tableName,
            Item: item,
        });

        try {
            await docClient.send(command);
            console.log(`${tableName} table filled with new item`);
        } catch (e) {
            console.log(`Error while adding item to the ${tableName} table`);
            console.log(e)
        }
    }
}

seedTable(products, 'products');
seedTable(stocks, 'stocks');
