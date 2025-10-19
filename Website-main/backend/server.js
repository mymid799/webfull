import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// 🧩 Import routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import windowsRoutes from "./routes/windowsRoutes.js";
import officeRoutes from "./routes/officeRoutes.js";
import toolsRoutes from "./routes/toolsRoutes.js";
import antivirusRoutes from "./routes/antivirusRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminInfoRoutes from "./routes/adminInfoRoutes.js";

dotenv.config();

// ✅ PHẢI TẠO app TRƯỚC khi dùng app.use()
const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Gắn route
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/windows", windowsRoutes);
app.use("/api/office", officeRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/antivirus", antivirusRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin-info", adminInfoRoutes);

// ⚙️ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
