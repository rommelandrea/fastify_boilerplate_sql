import { FastifyInstance } from 'fastify';
import App from './app';

/**
 * Initialize server
 *
 * @return {FastifyInstance} FastifyInstance
 */
async function initializeServer() {
  const app = new App();
  const subServer: FastifyInstance = await app.getServer();
  const port = Number.parseInt(process.env.PORT == null ? '5000' : process.env.PORT, 10);
  const host = process.env.HOST === undefined ? 'localhost' : process.env.HOST;
  subServer.listen(port, host, (err: Error, address: string) => {
    if (err) {
      subServer.log.error(err.message);
      process.exit(1);
    }
  });
  return subServer;
}

const server = initializeServer();

export default server;
