import { Schema, model } from "mongoose";

const Model = new Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    Numbers: [
      {
        image: { type: String, required: true },
        Rifa: { type: String, default: null },
        myNumbers: { type: Array, default: null },
        myNumbersPremied: { type: Array, default: null },
      },
    ],
  },
  { timestamps: true }
);

export default model("users", Model);
