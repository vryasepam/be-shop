import { handler } from '../catalogBatchProcess';
import DynamoDB from '@database/dynamoDB.js';

const mockEvent = {
  Records: [
    {
      body: JSON.stringify({
        title: 'Test Product',
        description: 'Test Description',
        count: 10,
        price: 20,
      }),
    },
  ],
};

describe('method: catalogBatchProcess', () => {
  it('should create products and publish notification', async () => {
    jest.mock(DynamoDB.createProduct).mockResolvedValueOnce();

    jest.mock(SnsService.publishProductCreationNotification).mockResolvedValueOnce();

    await handler(mockEvent, null, null);

    expect(DynamoDB).toHaveBeenCalledTimes(1);

    expect(DynamoDB.createProduct).toHaveBeenCalledWith({
      title: 'Test Product',
      description: 'Test Description',
      count: 10,
      price: 20,
    });

    expect(SnsService).toHaveBeenCalledTimes(1);

    expect(SnsService.publishProductCreationNotification).toHaveBeenCalledWith({
      message: 'Successfully created 1 product(s). 10 new item(s) were added',
      totalProductsInStock: 10,
    });
  });
});
