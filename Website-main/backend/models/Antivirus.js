import mongoose from "mongoose";

const antivirusSchema = new mongoose.Schema({
  type: { type: String, default: "normal" },
  toolName: String,
  mainLink: String,
  googleDrive: String,
  oneDrive: String,
  note: String,
});

const Antivirus = mongoose.model("Antivirus", antivirusSchema);
export default Antivirus;
