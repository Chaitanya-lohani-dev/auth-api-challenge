import express from 'express';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router()

router.get('/admin',adminMiddleware, (req, res) => {
    res.status(200).json("Admin route accesed")
} )

export default router