import mongoose from "mongoose";

const toolsSchema = new mongoose.Schema({
  toolName: { type: String },
  mainLink: { type: String },
  googleDrive: { type: String },
  ownCloud: { type: String },
  note: { type: String },

  // Dynamic fields for new columns
  dynamicFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  strict: false // Allow dynamic fields
});

export default mongoose.model("Tools", toolsSchema);
