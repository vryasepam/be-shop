import AWS from "aws-sdk";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamodbClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const handler = async (event, context, callback) => {
  console.log("getProductsList triggered");
  console.log(`getProductsList event - ${event}`);

  try {
    const productsTable = await dynamodbClient.send(new ScanCommand({ TableName: 'products' }));
    const stocksTable = await dynamodbClient.send(new ScanCommand({ TableName: 'stocks' }));

    const products = unmarshall(productsTable.Items);
    const stocks = unmarshall(stocksTable.Items);

    const result = products.map((product) => ({
      ...product,
      count: stocks.find((stock) => stock.productId === product.id).count,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    throw new Error('There are no products');
  }
};