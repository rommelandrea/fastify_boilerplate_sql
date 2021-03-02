import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import pino from 'pino';
import dotenv from 'dotenv';

/**
*
*/
class App {
  public server: Promise<FastifyInstance>;

  /**
    * Creates an instance of App.
    *
    * @memberof App
    */
  public constructor() {
    try {
      this.server = this.setup();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
    * Get Server return the instance of the server
    *
    * @return {Promise<FastifyInstance>}
    * @memberof App
    */
  public getServer() {
    return this.server;
  }

  /**
    * Inital setup of the server. When setup is ready return the FastifiInstance
    *
    * @private
    * @return {Promise<FastifyInstance>}
    * @memberof App
    */
  private async setup(): Promise<FastifyInstance> {
    dotenv.config();
    const server: FastifyInstance = await this.getFastifyInstance();
    server.log.debug('Initializing server...');
    this.server = this.registerAndDecorate(server);
    this.setupRoutes(server);
    return server;
  }

  /**
    * Create the fastify instance
    *
    * @return {FastifyInstance} Fastify instance
    */
  private async getFastifyInstance() {
    return fastify({
      pluginTimeout: 30000,
      logger: pino({
        level: 'debug',
        messageKey: 'message',
      }),
    });
  }

  /**
   * Register plugins and decorate
   *
   * @private
   * @param {FastifyInstance} server
   * @memberof App
   */
  private async registerAndDecorate(server: FastifyInstance) {
    // registerPlugins(server);
    // registerLanguageManagement(server);
    // Routes
    // server = initializeSetErrorHandler(server);


    server.addHook('preHandler', (req, reply, done) => {
      if (req.body) {
        req.log.info({ body: req.body }, 'parsed body');
      }
      done();
    });

    return server;
  }

  /**
   * Basic setup of routes
   *
   * @private
   * @param {FastifyInstance} server
   * @memberof App
   */
  private setupRoutes(server: FastifyInstance) {
    server.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
      reply
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            'success': true,
            'data': 'pong',
          });
    });
  }
}

export default App;
