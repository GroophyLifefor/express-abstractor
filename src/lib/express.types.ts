import { Request, Response, NextFunction } from 'express';

type Handler = (req: Request, res: Response) => void;
type Middleware =
  | Handler
  | ((req: Request, res: Response, next: NextFunction) => void);

export { Handler, Middleware };
