import { Router } from 'express';
import {
   getMe,
   login,
   register,
   refresh,
   logout,
   googleLogin,
   updateProfile,
   getUsers,
} from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/async.handler.js';
import { validate } from '../middlewares/validate.middleware.js';
import { userSchema } from '../schemas/user.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const userRoutes = Router();

userRoutes.post('/register', validate(userSchema), asyncHandler(register));
userRoutes.post(
   '/login',
   validate(userSchema.pick({ email: true, password: true })),
   asyncHandler(login)
);
userRoutes.post('/refresh', asyncHandler(refresh));
userRoutes.post('/logout', asyncHandler(logout));

// Google Login (New Decoupled Flow)
userRoutes.post('/social-auth', asyncHandler(googleLogin));

userRoutes.use(protect);
userRoutes.get('/me', asyncHandler(getMe));
userRoutes.patch('/profile', asyncHandler(updateProfile));

userRoutes.get('/', restrictTo('admin'), asyncHandler(getUsers));

export default userRoutes;
