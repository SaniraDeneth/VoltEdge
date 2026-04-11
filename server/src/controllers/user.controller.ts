import type { Request, Response } from 'express';
import User, { type TUser } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../enums/http.status.js';

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
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'Please provide all the required fields',
      });
   }

   const existingUser = await User.findOne({ email: email });
   if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'Email already registered',
      });
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   await User.create({
      name,
      email,
      password: hashedPassword,
   });

   res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User registered successfully',
   });
};

export const login = async (req: Request, res: Response) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'Please provide all the required fields',
      });
   }

   const user = await User.findOne({ email: email });
   if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'User not found',
      });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
         success: false,
         message: 'Invalid password',
      });
   }

   const token = generateJwtToken(user);

   res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User logged in successfully',
      token,
   });
};
