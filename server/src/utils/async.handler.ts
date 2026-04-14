import type { NextFunction, Request, Response } from 'express';

type AsyncHandler<T extends Request = Request> = (
   req: T,
   res: Response,
   next: NextFunction
) => Promise<unknown>;

export const asyncHandler = <T extends Request>(fn: AsyncHandler<T>) => {
   return (req: Request, res: Response, next: NextFunction) => {
      fn(req as T, res, next).catch(next);
   };
};
