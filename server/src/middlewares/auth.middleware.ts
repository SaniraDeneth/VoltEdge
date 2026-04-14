import type { NextFunction, Request, Response } from 'express';
import { verifyJwtToken } from '../utils/jwt.js';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import User from '../models/user.model.js';

export interface AuthRequest extends Request {
   user?: {
      id: string;
      email: string;
      role: 'admin' | 'user';
   };
}

export interface ProtectedRequest extends Request {
   user: {
      id: string;
      email: string;
      role: 'admin' | 'user';
   };
}

export const protect = async (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   try {
      let token;
      if (
         req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer')
      ) {
         token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
         throw new AppError(
            'Not authorized to access this route',
            HTTP_STATUS.UNAUTHORIZED,
            'UNAUTHORIZED'
         );
      }

      const decoded = verifyJwtToken(token) as {
         email: string;
         role: 'admin' | 'user';
         name: string;
      };

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
         throw new AppError(
            'The user belonging to this token no longer exists',
            HTTP_STATUS.UNAUTHORIZED,
            'USER_NOT_FOUND'
         );
      }

      req.user = {
         id: user._id.toString(),
         email: user.email,
         role: user.role,
      };

      next();
   } catch (error: unknown) {
      if (error instanceof Error) {
         if (error.name === 'JsonWebTokenError') {
            return next(
               new AppError(
                  'Invalid token. Please log in again!',
                  HTTP_STATUS.UNAUTHORIZED,
                  'UNAUTHORIZED'
               )
            );
         }
         if (error.name === 'TokenExpiredError') {
            return next(
               new AppError(
                  'Your token has expired! Please log in again.',
                  HTTP_STATUS.UNAUTHORIZED,
                  'UNAUTHORIZED'
               )
            );
         }
      }
      next(error);
   }
};

export const restrictTo = (...roles: Array<'admin' | 'user'>) => {
   return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
         throw new AppError(
            'You do not have permission to perform this action',
            HTTP_STATUS.FORBIDDEN,
            'FORBIDDEN'
         );
      }
      next();
   };
};
