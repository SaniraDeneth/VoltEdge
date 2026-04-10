import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { login, resgister } from './Controllers/userController.js';

dotenv.config();

const PORT = process.env.PORT;
connectDB();
const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World');
});

app.post('/register', resgister);
app.post('/login', login);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
