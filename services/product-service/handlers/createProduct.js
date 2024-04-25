import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { v4 as uuidv4 } from 'uuid';

const dynamodbClient = new DynamoDBClient({
    region: 'us-east-1'
  });
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

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

        const command = new TransactWriteItemsCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: 'products',
                        Item: marshall({
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            price: product.price,
                        }),
                    },
                },
                {
                    Put: {
                        TableName: 'stocks',
                        Item: marshall({
                            productId: product.id,
                            count: product.count,
                        }),
                    },
                },
            ],
        });
        await docClient.send(command);

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
        return {
            statusCode: 500,
            body: JSON.stringify('Creation of product failed'),
        }
    }
};
