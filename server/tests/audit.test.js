const request = require('supertest');
const app = require('../app');
const nock = require('nock');

describe('Audit API Tests', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('Should analyze a valid website successfully', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Website</title>
          <meta name="description" content="Test description">
        </head>
        <body>
          <h1>Welcome</h1>
          <h1>Second Heading</h1>
          <img src="image1.jpg" alt="Valid alt">
          <img src="image2.jpg">
          <p>This is a test paragraph with some words.</p>
          <p>Another paragraph here.</p>
        </body>
      </html>
    `;

    nock('https://test-example.com')
      .get('/')
      .reply(200, mockHtml, {
        'content-type': 'text/html'
      });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://test-example.com' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.report).toHaveProperty('status', 200);
    expect(response.body.report).toHaveProperty('title', 'Test Website');
    expect(response.body.report).toHaveProperty('metaDescription', 'Test description');
    expect(response.body.report).toHaveProperty('h1Count', 2);
    expect(response.body.report).toHaveProperty('imagesWithoutAlt', 1);
    expect(response.body.report).toHaveProperty('wordCount');
    expect(response.body.report).toHaveProperty('responseTime');
  });

  test('Should return error for invalid URL format', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'not-a-valid-url' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid URL');
  });

  test('Should return error for unreachable website', async () => {
    nock('https://unreachable.com')
      .get('/')
      .replyWithError('ECONNREFUSED');

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://unreachable.com' })
      .expect(503);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('unreachable');
  });

  test('Should return error for DNS failure', async () => {
    nock('https://dns-failure.com')
      .get('/')
      .replyWithError('ENOTFOUND');

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://dns-failure.com' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('DNS');
  });

  test('Should return error for missing URL', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('URL is required');
  });

  test('Should handle timeout', async () => {
    nock('https://timeout.com')
      .get('/')
      .delayConnection(15000)
      .reply(200, '<html></html>');

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://timeout.com' })
      .expect(504);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('timed out');
  });

  test('Should handle non-HTML content', async () => {
    nock('https://nonhtml.com')
      .get('/')
      .reply(200, '{"json": "data"}', {
        'content-type': 'application/json'
      });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://nonhtml.com' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('HTML');
  });
});