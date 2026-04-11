import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const PORT = process.env.PORT;
connectDB();
const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
