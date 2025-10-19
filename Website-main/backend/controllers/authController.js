import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = "safedownload_secret_2025"; // Có thể lưu trong .env

// Đăng ký tài khoản admin (chạy 1 lần để tạo tài khoản)
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập admin
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đổi mật khẩu admin
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    // Kiểm tra các tiêu chí bảo mật mật khẩu
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 8 ký tự!",
        code: "PASSWORD_TOO_SHORT"
      });
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!hasUpperCase) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 1 chữ cái HOA!",
        code: "NO_UPPERCASE"
      });
    }

    if (!hasLowerCase) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 1 chữ cái thường!",
        code: "NO_LOWERCASE"
      });
    }

    if (!hasNumbers) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 1 chữ số!",
        code: "NO_NUMBERS"
      });
    }

    if (!hasSpecialChar) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!",
        code: "NO_SPECIAL_CHAR"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Verify current password
    const validCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validCurrentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ error: err.message });
  }
};

// Verify admin status
export const verifyAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        isAdmin: false,
        message: "Token required"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        isAdmin: false,
        message: "User not found"
      });
    }

    // Nếu user tồn tại trong database thì là admin
    res.json({
      isAdmin: true,
      message: "Admin verified",
      username: user.username
    });

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        isAdmin: false,
        message: "Invalid token"
      });
    }
    res.status(500).json({
      isAdmin: false,
      error: err.message
    });
  }
};
