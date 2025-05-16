import coreExpress, { Express as ExpressType } from 'express';

import { Handler, Middleware } from './express.types';
import { endLogWithTags, logWithTags } from './logging';
import { formatHRTime } from './timeFormatter';

class Express {
  private expressInstance: ExpressType;

  constructor() {
    this.expressInstance = coreExpress();
    this.use('Request', (_req, _res, next) => next());
  }

  /**
   * Wraps middleware with logging and optional metadata.
   * Captures timing information and logs start/end of middleware execution.
   * 
   * @param label - Label for the middleware.
   * @param middleware - The middleware function to wrap.
   * @param meta - Optional metadata to include in logs.
   */
  private wrapMiddleware(
    label: string,
    middleware: Middleware,
    meta?: Record<string, any>
  ): Middleware {
    return async (req, res, next) => {
      logWithTags(label, meta);
      const hrtime = process.hrtime();
      middleware(req, res, next);
      const [seconds, nanoseconds] = process.hrtime(hrtime);
      const formattedTime = formatHRTime(seconds, nanoseconds);
      endLogWithTags(label, { elapsed: formattedTime });
    };
  }

  use(middlewareNameOrFn: Middleware | string, middlewareFn?: Middleware) {
    let middlewareToUse: Middleware;

    /**
     * Cases for middleware registration:
     * 
     * 1. String name only (error case)
     *    ex. app.use('auth'); // Error: Missing middleware function for 'auth'
     * 
     * 2. Named middleware function (traced with custom name)
     *    ex. app.use('auth', checkAuthToken); // Logs as "auth"
     * 
     * 3. Direct middleware function (traced as 'Anonymous')
     *    ex. app.use(checkAuthToken); // Logs as "Anonymous"
     */

    const name = typeof middlewareNameOrFn === 'string' ? middlewareNameOrFn : 'Anonymous';
    const middleware = typeof middlewareNameOrFn === 'string' ? middlewareFn : middlewareNameOrFn;

    if (typeof middlewareNameOrFn === 'string' && !middlewareFn) {
      throw new Error(`Missing middleware function for ${middlewareNameOrFn}`);
    }

    middlewareToUse = this.wrapMiddleware(name, middleware, {
      type: 'middleware'
    });

    this.expressInstance.use(middlewareToUse);
  }

  get(path: string, handler: Handler) {
    const wrappedHandler = this.wrapMiddleware('Handler', handler, {
      type: 'handler',
      method: 'GET',
      path,
    });
    this.expressInstance.get(path, wrappedHandler);
  }

  listen(port: number, callback: () => void) {
    this.expressInstance.listen(port, callback);
  }
}

const expressAbstractor = () => new Express();

const log = (message: string, meta?: Record<string, string>) => {
  logWithTags('log', meta);
  console.log(message);
  endLogWithTags('log');
};

export default expressAbstractor;
export { log };
