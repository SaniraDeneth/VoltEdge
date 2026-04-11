import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';

export const globalExceptionHandler = (
   err: Error & { statusCode?: number },
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   console.error(err.stack);

   const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
   const message = err.message || 'Internal server error';

   res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
   });
};
