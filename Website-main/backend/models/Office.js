import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  version: { type: String },
  edition: { type: String },

  // Fshare
  fshare32: { type: String },
  fshare64: { type: String },
  fshareCommon: { type: String },
  fshareShow: {
    type: String,
    enum: ["32", "64", "common", "both", "none"],
    default: "both",
  },

  // Google Drive
  drive32: { type: String },
  drive64: { type: String },
  driveCommon: { type: String },
  driveShow: {
    type: String,
    enum: ["32", "64", "common", "both", "none"],
    default: "both",
  },

  // OneDrive
  oneDrive32: { type: String },
  oneDrive64: { type: String },
  oneDriveCommon: { type: String },
  oneDriveShow: {
    type: String,
    enum: ["32", "64", "common", "both", "none"],
    default: "both",
  },

  sha1: { type: String },
});

export default mongoose.model("Office", officeSchema);
