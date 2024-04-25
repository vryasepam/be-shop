import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1'
});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event, context, callback) => {
  console.log("getProductsList triggered");
  console.log(`getProductsList event - ${event}`);

  try {
    const productsTable = (await docClient.send(new ScanCommand({ TableName: 'products' }))).Items;
    const stocksTable = (await docClient.send(new ScanCommand({ TableName: 'stocks' }))).Items;

    const result = productsTable.map((product) => ({
      ...product,
      count: stocksTable.find((stock) => stock.productId === product.id).count,
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result),
    }
  } catch (error) {
    throw new Error('There are no products');
  }
};