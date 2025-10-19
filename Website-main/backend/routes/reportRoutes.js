import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getAllReports,
    getReportById,
    getReportsByCategory,
    getReportsByStatus,
    createReport,
    updateReportStatus,
    deleteReport,
    getReportStats
} from "../controllers/reportController.js";

const router = express.Router();

// Routes cho người dùng (không cần authentication)
router.post("/", createReport);
router.get("/public", getAllReports); // Public endpoint để xem báo cáo
router.get("/public/stats", getReportStats); // Public endpoint để xem thống kê

// Routes cho admin (cần authentication)
router.get("/", verifyToken, getAllReports);
router.get("/:id", verifyToken, getReportById);
router.get("/stats", verifyToken, getReportStats);
router.get("/category/:category", verifyToken, getReportsByCategory);
router.get("/status/:status", verifyToken, getReportsByStatus);
router.put("/:id/status", verifyToken, updateReportStatus);
router.delete("/:id", verifyToken, deleteReport);

export default router;