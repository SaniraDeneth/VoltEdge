import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { type UserDocument } from '../models/user.model.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import { AppError } from '../utils/app.error.js';
import { z } from 'zod';
import { userSchema } from '../schemas/user.schema.js';
import jwt from 'jsonwebtoken';

const generateJwtToken = (user: UserDocument) => {
   return jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET as jwt.Secret,
      {
         expiresIn: '7d',
      }
   );
};

type RegisterInput = z.infer<typeof userSchema>;
type LoginInput = Pick<RegisterInput, 'email' | 'password'>;

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

   return res.status(HTTP_STATUS.CREATED).json(user.toJSON());
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

   const token = generateJwtToken(user);

   return res.status(HTTP_STATUS.OK).json({ token });
};
