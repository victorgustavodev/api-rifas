import { Router } from "express";
import productsModel from "../../database/models/products";
import multer from "multer";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 }, // 200 KB
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, cota, totalBilhetes } = req.body;
    const image = req.file;

    if (!name || !price || !totalBilhetes) {
      return res.status(400).json({
        "en-message": "Name, price and total tickets are required.",
        "pt-br-message": "Nome, preço e total de bilhetes são obrigatórios.",
      });
    }

    if (image) {
      const regexBase64 =
        /data:image\/(bmp|gif|ico|jpg|jpeg|png|svg|webp|x-icon|svg+xml);base64,/;
      const base64Image = `data:${
        image.mimetype
      };base64,${image.buffer.toString("base64")}`;

      if (!regexBase64.test(base64Image)) {
        return res.status(400).json({
          "en-message": "Invalid Image.",
          "pt-br-message": "Imagem inválida.",
        });
      }
    }

    const product = await new productsModel({
      name,
      image: image
        ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
        : undefined,
      price,
      cotaPremiada: cota,
      totalBilhetes,
    }).save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ "error-message": "An error has occurred." });
  }
});

export default router;
