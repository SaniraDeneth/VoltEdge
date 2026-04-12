import type { Request, Response } from 'express';
import User, { type TUser } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../enums/http.status.js';
import { AppError } from '../utils/app.error.js';

const generateJwtToken = (user: TUser) => {
   return jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET as jwt.Secret,
      {
         expiresIn: '7d',
      }
   );
};

export const register = async (req: Request, res: Response) => {
   const { name, email, password } = req.body;

   if (!name || !email || !password) {
      throw new AppError(
         'Please provide all the required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

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

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { password: _, ...userResponse } = user.toObject();

   return res.status(HTTP_STATUS.CREATED).json(userResponse);
};

export const login = async (req: Request, res: Response) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new AppError(
         'Please provide all the required fields',
         HTTP_STATUS.BAD_REQUEST,
         'VALIDATION_ERROR'
      );
   }

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

   return res.status(HTTP_STATUS.OK).json({
      token,
   });
};
