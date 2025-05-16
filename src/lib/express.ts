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
      const metaAttributes = meta
        ? Object.entries(meta)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')
            .trim()
        : null;

      logWithTags(label, metaAttributes ? { ...meta } : undefined);
      const hrtime = process.hrtime();
      middleware(req, res, next);
      const [seconds, nanoseconds] = process.hrtime(hrtime);
      const formattedTime = formatHRTime(seconds, nanoseconds);
      endLogWithTags(label, { elapsed: formattedTime });
    };
  }

  use(nameOrMiddleware: Middleware | string, middlewareIfNamed?: Middleware) {
    let middlewareToUse: Middleware;

    if (typeof nameOrMiddleware === 'string') {
      if (!middlewareIfNamed) {
        throw new Error(
          'If you pass a string as the first argument, you must also pass a middleware as the second argument.'
        );
      }

      middlewareToUse = this.wrapMiddleware(
        nameOrMiddleware,
        middlewareIfNamed,
        {
          type: 'middleware',
        }
      );
    } else {
      middlewareToUse = this.wrapMiddleware('Anonymous', nameOrMiddleware, {
        type: 'middleware',
      });
    }

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
