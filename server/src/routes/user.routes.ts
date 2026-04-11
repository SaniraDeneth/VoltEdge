import { Router } from 'express';
import { login, register } from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/async.handler.js';

const userRoutes = Router();

userRoutes.post('/register', asyncHandler(register));
userRoutes.post('/login', asyncHandler(login));

export default userRoutes;
