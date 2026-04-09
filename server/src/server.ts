import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

dotenv.config();

const PORT = process.env.PORT;
connectDB();
const app = express();

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World');
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
