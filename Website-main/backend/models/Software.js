import mongoose from "mongoose";

const softwareSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // ví dụ: "windows", "office", ...
    version: { type: String },
    edition: { type: String },
    sha1: { type: String },
    // Cho phép lưu thêm các cột động
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Column configuration fields
    type: { type: String }, // 'column_config' for column configurations
    columns: { type: [mongoose.Schema.Types.Mixed] }, // Array of column definitions
  },
  { timestamps: true }
);

export default mongoose.model("Software", softwareSchema);
