import AWS from "aws-sdk";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { v4 as uuidv4 } from 'uuid';

const dynamodbClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
        await dynamodbClient.send(command);

        console.log('Product has been created');

        return {
            statusCode: 200,
            body: JSON.stringify(product),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify('Creation of product failed'),
        }
    }
};
