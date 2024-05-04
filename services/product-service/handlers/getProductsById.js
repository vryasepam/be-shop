import DynamoDB from '@database/dynamoDB.js';

export const handler = async (event, context, cb) => {
  console.log("getProductsById triggered");
  console.log(`getProductsById event - ${event}`);

  try {
    const { productId } = event.pathParameters;

    const dynamoDbProvider = new DynamoDB()

    const foundProduct = await dynamoDbProvider.getProductById(productId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(foundProduct),
    }
  } catch (error) {
    console.log(error);
    throw new Error('Product is not found');
  }
};
