import { handler } from '../importProductsFile';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
}));
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('method: importProductFiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return signed url', async () => {
    const mockSignedUrl = 'https://mock-signed-url.com';
    const mockKey = 'mock-file.csv';

    getSignedUrl.mockResolvedValue(mockSignedUrl);

    const event = {
      queryStringParameters: {
        name: mockKey
      }
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockSignedUrl);
  });
});
