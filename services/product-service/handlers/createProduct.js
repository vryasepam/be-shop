import { v4 as uuidv4 } from 'uuid';
import DynamoDB from '@database/dynamoDB.js';

export const handler = async (event, context, cb) => {
    console.log("createProduct triggered");
    console.log(`createProduct event - ${event}`);

    try {
        const { title, description, count, price } = JSON.parse(event.body);

        if (!title || !description || !price || !count) {
            throw new Error('Given invalid product value')
        }

        const product = {
            id: uuidv4(),
            title,
            description,
            price,
            count
        }

        const dynamoDbProvider = new DynamoDB()

        await dynamoDbProvider.createProduct(product)

        console.log('Product has been created');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
            body: JSON.stringify(product),
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Creation of product failed'),
        }
    }
};
