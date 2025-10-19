import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getAdminInfo,
    updateAdminInfo,
    getAdminInfoForAdmin
} from "../controllers/adminInfoController.js";

const router = express.Router();

// Routes cho người dùng (không cần authentication)
router.get("/public", getAdminInfo);

// Routes cho admin (cần authentication)
router.get("/", verifyToken, getAdminInfoForAdmin);
router.put("/", verifyToken, updateAdminInfo);

export default router;
