import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import { AppError } from '../utils/app.error.js';
import { z } from 'zod';
import { userSchema } from '../schemas/user.schema.js';
import {
   generateAccessToken,
   generateRefreshToken,
   verifyRefreshToken,
} from '../utils/jwt.js';
import type { ProtectedRequest } from '../middlewares/auth.middleware.js';

type RegisterInput = z.infer<typeof userSchema>;
type LoginInput = Pick<RegisterInput, 'email' | 'password'>;

const COOKIE_OPTIONS = {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'lax' as const,
   maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const register = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { name, email, password } = req.body as RegisterInput;

   const existingUser = await User.findOne({ email });
   if (existingUser) {
      throw new AppError(
         'Email already registered',
         HTTP_STATUS.BAD_REQUEST,
         'ALREADY_EXISTS'
      );
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const user = await User.create({
      name,
      email,
      password: hashedPassword,
   });

   const payload = { email: user.email, name: user.name, role: user.role };
   const accessToken = generateAccessToken(payload);
   const refreshToken = generateRefreshToken(payload);

   res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

   return res.status(HTTP_STATUS.CREATED).json({
      user: user.toJSON(),
      token: accessToken,
   });
};

export const login = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const { email, password } = req.body as LoginInput;

   const user = await User.findOne({ email });

   if (!user) {
      throw new AppError(
         'User not found',
         HTTP_STATUS.BAD_REQUEST,
         'NOT_FOUND'
      );
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      throw new AppError(
         'Invalid password',
         HTTP_STATUS.BAD_REQUEST,
         'UNAUTHORIZED'
      );
   }

   const payload = {
      email: user.email,
      name: user.name,
      role: user.role,
   };
   const accessToken = generateAccessToken(payload);
   const refreshToken = generateRefreshToken(payload);

   res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

   return res.status(HTTP_STATUS.OK).json({
      user: user.toJSON(),
      token: accessToken,
   });
};

export const refresh = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
      throw new AppError(
         'No refresh token provided',
         HTTP_STATUS.UNAUTHORIZED,
         'UNAUTHORIZED'
      );
   }

   try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
         throw new AppError(
            'User not found',
            HTTP_STATUS.UNAUTHORIZED,
            'UNAUTHORIZED'
         );
      }

      const payload = { email: user.email, name: user.name, role: user.role };
      const accessToken = generateAccessToken(payload);

      return res.status(HTTP_STATUS.OK).json({ token: accessToken });
   } catch {
      throw new AppError(
         'Invalid refresh token',
         HTTP_STATUS.UNAUTHORIZED,
         'UNAUTHORIZED'
      );
   }
};

export const logout = async (
   req: Request,
   res: Response,
   _next: NextFunction
) => {
   res.clearCookie('refreshToken', {
      ...COOKIE_OPTIONS,
      maxAge: 0,
   });
   return res.status(HTTP_STATUS.OK).json({ message: 'Logged out' });
};

export const getMe = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const user = await User.findById(req.user.id);
   if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
   }

   return res.status(HTTP_STATUS.OK).json(user.toJSON());
};
