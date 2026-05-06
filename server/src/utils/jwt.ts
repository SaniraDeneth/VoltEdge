import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

type JwtPayload = {
   email: string;
   name: string;
   role: 'admin' | 'user';
};

export const generateAccessToken = (payload: JwtPayload) => {
   return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '15m',
   });
};

export const generateRefreshToken = (payload: JwtPayload) => {
   return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
   });
};

export const verifyAccessToken = (token: string) => {
   return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
   return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JwtPayload;
};
