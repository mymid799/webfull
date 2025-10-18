import mongoose from "mongoose";

const windowsSchema = new mongoose.Schema({
  version: { type: String },
  edition: { type: String },

  // Fshare links
  fshare32: { type: String },
  fshare64: { type: String },
  fshareShow: {
    type: String,
    enum: ["32", "64", "both", "none"],
    default: "both",
  },

  // Google Drive links
  drive32: { type: String },
  drive64: { type: String },
  driveShow: {
    type: String,
    enum: ["32", "64", "both", "none"],
    default: "both",
  },

  // OneDrive links
  oneDrive32: { type: String },
  oneDrive64: { type: String },
  oneDriveShow: {
    type: String,
    enum: ["32", "64", "both", "none"],
    default: "both",
  },

  sha1: { type: String },
});

export default mongoose.model("Windows", windowsSchema);
