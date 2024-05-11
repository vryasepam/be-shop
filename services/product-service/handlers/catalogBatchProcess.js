import DynamoDB from '@database/dynamoDB.js';
import SnsService from '@services/snsService';

export const handler = async (event, context, cb) => {
    console.log('catalogBatchEvent: ', event);

    const { Records } = event;

    const productsPromises = [];
    const totalCount = 0;

    try {
        const dynamoDbProvider = new DynamoDB()

        for (const record of Records) {
            const { title, description, count, price } = JSON.parse(record.body);

            if (!title || !description || !price || !count) {
                throw new Error('Given invalid product value')
            }

            totalCount += count;
            productsPromises.push(dynamoDbProvider.createProduct({ title, description, count, price }));
        }

        await Promise.all(productsPromises);

        const snsService = new SnsService();

        const message = `Successfully created ${productsPromises.length} product(s). ${totalCount} new item(s) were added`;

        await snsService.publishProductCreationNotification({ message, totalProductsInStock: totalCount });
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Creation of product failed'),
        }
    }
}
