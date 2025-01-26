import { Schema, model } from "mongoose";

const Model = new Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
    },
    status: { type: Boolean, default: true },
    price: { type: Number, required: true },
    minBilhetes: { type: Number, default: 1 },
    totalBilhetes: { type: Number, required: true },
    cotaPremiada: { type: Number, default: 0 },
    bilhetesPremiados: { type: Array, default: [] },
    bilhetesBlacklist: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default model("rifas", Model);
