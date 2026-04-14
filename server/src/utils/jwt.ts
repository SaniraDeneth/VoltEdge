import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

type JwtPayload = {
   email: string;
   name: string;
   role: 'admin' | 'user';
};

export const generateJwtToken = (payload: JwtPayload) => {
   return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '7d',
   });
};

export const verifyJwtToken = (token: string) => {
   return jwt.verify(token, ENV.JWT_SECRET);
};
