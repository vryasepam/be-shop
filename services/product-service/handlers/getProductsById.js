import AWS from "aws-sdk";
import { TransactGetItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamodbClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
    const response = await dynamodbClient.send(command);
    const [product, stock] = response.Responses;

    if (!product.Item || !stock.Item) {
      throw new Error('Product is not found with given ID');
    }

    const unmarshalProduct = unmarshall(product.Item)
    const unmarshalStock = unmarshall(stock.Item)

    const foundProduct = { ...unmarshalProduct, count: unmarshalStock.count }

    return {
      statusCode: 200,
      body: JSON.stringify(foundProduct),
    }
  } catch (error) {
    throw new Error('Product is not found');
  }
};
