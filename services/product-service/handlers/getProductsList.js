import DynamoDB from '@database/dynamoDB.js';

export const handler = async (event, context, callback) => {
  console.log("getProductsList triggered");
  console.log(`getProductsList event - ${event}`);

  try {
    const dynamoDbProvider = new DynamoDB()

    const result = await dynamoDbProvider.getProducts()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result),
    }
  } catch (error) {
    console.log(error);
    throw new Error('There are no products');
  }
};
