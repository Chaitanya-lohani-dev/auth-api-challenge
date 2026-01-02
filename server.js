import express from 'express';
import cors from 'cors';
import authRoutes from './route/authRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(CookieParser())

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
