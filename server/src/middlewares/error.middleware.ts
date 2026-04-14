import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http.status.js';
import { AppError } from '../utils/app.error.js';
import { ENV } from '../config/env.js';

interface IErrorResponse {
   error: {
      code: string;
      message: string;
      details?: unknown | undefined;
      stack?: string | undefined;
   };
}

export const globalExceptionHandler = (
   err: Error | AppError,
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const statusCode =
      err instanceof AppError
         ? err.statusCode
         : HTTP_STATUS.INTERNAL_SERVER_ERROR;
   const code = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
   const message = err.message || 'Internal server error';

   const errorResponse: IErrorResponse = {
      error: {
         code,
         message,
      },
   };

   if (err instanceof AppError && err.details) {
      errorResponse.error.details = err.details;
   }

   if (ENV.NODE_ENV === 'development' && err.stack) {
      errorResponse.error.stack = err.stack;
      console.error(err.stack);
   }

   res.status(statusCode).json(errorResponse);
};
