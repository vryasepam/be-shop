import {
    ScanCommand,
    TransactGetItemsCommand,
    TransactWriteItemsCommand,
  } from "@aws-sdk/client-dynamodb";
  import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
  
import dynamodbClient from './instance'

class DynamoDB {
    productsTable = 'products'
    stocksTable = 'stocks'

    async getProducts() {
        const productsTable = await dynamodbClient.send(new ScanCommand({ TableName: this.productsTable }));
        const stocksTable = await dynamodbClient.send(new ScanCommand({ TableName: this.stocksTable }));

        const products = productsTable.Items.map(item => unmarshall(item));
        const stocks = stocksTable.Items.map(item => unmarshall(item));
    
        const result = products.map((product) => ({
          ...product,
          count: stocks.find((stock) => stock.productId === product.id).count,
        }));

        return result;
    }

    async getProductById(id) {
        const command = new TransactGetItemsCommand({
            TransactItems: [
              {
                Get: {
                  TableName: this.productsTable,
                  Key: marshall({ id }),
                },
              },
              {
                Get: {
                  TableName: this.stocksTable,
                  Key: marshall({ productId: id }),
                },
              },
            ],
          });
          const response = await dynamodbClient.send(command);
          const [product, stock] = response.Responses;
      
          if (!product.Item || !stock.Item) return null;
      
          const foundProduct = { ...unmarshall(product.Item), count: unmarshall(stock.Item).count }

          return foundProduct;
    }

    async createProduct(product) {
        const command = new TransactWriteItemsCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: this.productsTable,
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
                        TableName: this.stocksTable,
                        Item: marshall({
                            productId: product.id,
                            count: product.count,
                        }),
                    },
                },
            ],
        });
        await dynamodbClient.send(command);

        return product;
    }
}

export default DynamoDB;
