export const handler = async (event, context, cb) => {
    try {
      const { productId } = event.pathParameters;
      const { default: mockProducts } = await import("../mock/mockProducts.json");
      const product = mockProducts.find(({ id }) => productId === id);
  
      if (!product) {
        throw new Error('Product is not found with given ID');
      }
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(product),
      }
    } catch(error) {
      throw new Error('Product is not found');
    }
  };
