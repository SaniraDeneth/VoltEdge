import express from 'express';
import connectDB from './config/database.config.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import { globalExceptionHandler } from './middlewares/error.middleware.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import { ENV } from './config/env.js';

connectDB();
const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(globalExceptionHandler);

app.listen(ENV.PORT, () => {
   console.log(`Server is running on http://localhost:${ENV.PORT}`);
});
