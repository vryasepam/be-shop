export const handler = async (event, context, callback) => {

    try {
      const { default: mockProducts } = await import("../mock/mockProducts.json");

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(mockProducts),
        }
    } catch(error) {
      throw new Error('There are no products');
    }
  
  };