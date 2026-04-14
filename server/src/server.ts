import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.config.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import { globalExceptionHandler } from './middlewares/error.middleware.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();

const PORT = process.env.PORT;
connectDB();
const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);

app.use(globalExceptionHandler);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
