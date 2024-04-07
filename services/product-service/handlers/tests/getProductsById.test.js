import { describe, expect, test } from '@jest/globals';
import { handler } from '../getProductsById';

const mockId = '7567ec4b-b10c-48c5-9345-fc73c48a80ag';

describe('method: getProductsById', () => {
    test('should find product by id' , async () => {
        const event = { pathParameters: { productId: mockId } }

        const { body } = await handler(event);
        expect(JSON.parse(body).title).toBe('Random Product 7');
    })
})
