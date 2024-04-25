import { DynamoDBClient, TransactGetItemsCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1'
});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event, context, cb) => {
  console.log("getProductsById triggered");
  console.log(`getProductsById event - ${event}`);

  try {
    const { productId } = event.pathParameters;

    const command = new TransactGetItemsCommand({
      TransactItems: [
        {
          Get: {
            TableName: 'products',
            Key: marshall({ id: productId }),
          },
        },
        {
          Get: {
            TableName: 'stocks',
            Key: marshall({ productId }),
          },
        },
      ],
    });
    const response = await docClient.send(command);
    const [product, stock] = response.Responses;

    if (!product.Item || !stock.Item) {
      throw new Error('Product is not found with given ID');
    }

    const foundProduct = { ...unmarshall(product.Item), count: unmarshall(stock.Item).count }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(foundProduct),
    }
  } catch (error) {
    throw new Error('Product is not found');
  }
};
