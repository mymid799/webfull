import mongoose from "mongoose";

const toolsSchema = new mongoose.Schema({
  toolName: { type: String, required: false },
  mainLink: { type: String, required: false },
  googleDrive: { type: String, required: false },
  ownCloud: { type: String, required: false },
  note: { type: String, required: false },
});

const Tools = mongoose.model("Tools", toolsSchema);
export default Tools;
