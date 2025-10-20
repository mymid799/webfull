import mongoose from "mongoose";

const windowsSchema = new mongoose.Schema({
  version: { type: String },
  edition: { type: String },
  sha1: { type: String },

  // Fshare links (legacy support)
  fshare32: { type: String },
  fshare64: { type: String },
  fshareShow: {
    type: String,
    enum: ["32", "64", "both", "none"],
    default: "both",
  },

  // Google Drive links (legacy support)
  drive32: { type: String },
  drive64: { type: String },
  driveShow: {
    type: String,
    enum: ["32", "64", "both", "none"],
    default: "both",
  },

  // OneDrive links (legacy support)
  oneDrive32: { type: String },
  oneDrive64: { type: String },
  oneDriveShow: {
    type: String,
    enum: ["32", "64", "both", "none"],
    default: "both",
  },

  // Dynamic fields for new columns
  dynamicFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  strict: false // Allow dynamic fields
});

export default mongoose.model("Windows", windowsSchema);
