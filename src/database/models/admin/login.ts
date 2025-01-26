import { Schema, model } from "mongoose";

const Model = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default model("admins", Model);