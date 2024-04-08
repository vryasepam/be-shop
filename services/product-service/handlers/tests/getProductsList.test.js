import { describe, expect, test } from '@jest/globals';
import { handler } from '../getProductsList';

describe('method: getProductsList', () => {
    test('should return array' , async () => {

        const { body } = await handler();
        expect(Array.isArray(JSON.parse(body))).toBeTruthy()
    })
})