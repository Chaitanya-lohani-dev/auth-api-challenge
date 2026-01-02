import express from 'express';
import { register, login, logout , refresh} from '../controllers/authController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user);
})
router.post('/refresh-token', refresh)
router.post('/logout', logout);

export default router;