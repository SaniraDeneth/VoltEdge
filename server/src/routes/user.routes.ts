import { Router } from 'express';
import { login, register } from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { validate } from '../middlewares/validate.middleware.js';
import { userSchema } from '../schemas/user.schema.js';

const userRoutes = Router();

userRoutes.post('/register', validate(userSchema), asyncHandler(register));
userRoutes.post(
   '/login',
   validate(userSchema.pick({ email: true, password: true })),
   asyncHandler(login)
);

export default userRoutes;
