import express from 'express';
import connectDB from './config/database.config.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import { globalExceptionHandler } from './middlewares/error.middleware.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { stripeWebhook } from './controllers/payment.controller.js';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';

connectDB();
const app = express();

// Stripe Webhook MUST come before express.json() because it needs the raw body
app.post(
   '/api/payments/webhook',
   express.raw({ type: 'application/json' }),
   stripeWebhook
);

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', ENV.FRONTEND_URL);
   res.header('Access-Control-Allow-Credentials', 'true');
   res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
   );
   res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Cookie'
   );

   if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
   }

   next();
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.use(globalExceptionHandler);

app.listen(ENV.PORT, () => {
   console.log(`Server is running on http://localhost:${ENV.PORT}`);
});
