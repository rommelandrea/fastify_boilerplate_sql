import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import App from '../src/app';

describe('/ping', () => {
  let server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>|null;

  beforeAll(() => {});

  beforeEach(async () => {
    const app = new App();
    server = await app.getServer();
    // eslint-disable-next-line global-require
    // server.register(statusRoutes);
    await server.ready();

    jest.clearAllMocks();
  });

  it('GET returns 200', async (done) => {
    const response = await server.inject({ method: 'GET', url: '/ping' });
    expect(response.statusCode).toEqual(200);
    const payload: { data: string; success: boolean } = JSON.parse(
        response.payload,
    );
    expect(payload).toMatchSnapshot({ data: expect.any(String), success: true });

    done();
  });

  it('POST returns 404', async (done) => {
    const response = await server.inject({ method: 'POST', url: '/ping' });
    expect(response.statusCode).toEqual(404);
    expect(response.payload).toMatchSnapshot();

    done();
  });
});
