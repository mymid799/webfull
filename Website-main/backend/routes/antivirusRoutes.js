import express from "express";
import Antivirus from "../models/Antivirus.js";
import {
  getAntivirus,
  addAntivirus,
  updateAntivirus,
  deleteAntivirus,
} from "../controllers/antivirusController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lấy danh sách Antivirus
router.get("/", getAntivirus);

// CRUD cơ bản
router.post("/", verifyToken, addAntivirus);
router.put("/:id", verifyToken, updateAntivirus);
router.delete("/:id", verifyToken, deleteAntivirus);

// ✅ Lưu toàn bộ danh sách (ghi đè)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData))
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });

    // Xóa dữ liệu cũ
    await Antivirus.deleteMany({});
    // Lưu dữ liệu mới
    await Antivirus.insertMany(newData);

    res.json({ message: "✅ Dữ liệu Antivirus đã lưu thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Lỗi khi lưu dữ liệu!" });
  }
});

export default router;
