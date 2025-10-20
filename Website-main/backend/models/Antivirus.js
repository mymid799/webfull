import mongoose from "mongoose";

const antivirusSchema = new mongoose.Schema({
  type: { type: String, default: "normal" },
  toolName: String,
  mainLink: String,
  googleDrive: String,
  oneDrive: String,
  note: String,

  // Note row fields
  noteContent: String,
  createdAt: String,

  // Dynamic fields for new columns
  dynamicFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  strict: false // Allow dynamic fields
});

export default mongoose.model("Antivirus", antivirusSchema);
