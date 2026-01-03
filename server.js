import express from 'express';
import cors from 'cors';
import authRoutes from './route/authRoutes.js';
import adminRoutes from './route/adminRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ credentials: true}));
app.use(express.json());
app.use(CookieParser())

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
