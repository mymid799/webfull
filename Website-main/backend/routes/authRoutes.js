import express from "express";
import { registerAdmin, loginAdmin, changePassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerAdmin); // chỉ dùng 1 lần để tạo tài khoản
router.post("/login", loginAdmin);
router.post("/change-password", changePassword);

export default router;
