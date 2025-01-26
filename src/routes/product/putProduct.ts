import multer from "multer";
import productsModel from "../../database/models/products";
import { Router } from "express";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 },
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, price, cota } = req.body;
    const image = req.file;

    if (!name || !status || !price) {
      return res.status(400).json({
        "en-message": "Invalid parameters",
        "pt-br-message": "Parâmetros inválidos",
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

    const productsSchema = await productsModel.findOne({ _id: id });
    if (!productsSchema) {
      return res.status(404).json({
        "en-message": "Product not found",
        "pt-br-message": "Produto não encontrado",
      });
    }

    await productsModel.updateOne(
      { _id: id },
      {
        name,
        status,
        price,
        cotaPremiada: cota,
        image: image
          ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
          : undefined,
      }
    );

    return res.json(await productsModel.findOne({ _id: id }));
  } catch (err) {
    console.error(err);
    return res.status(400).json({ "error-message": "An error has occurred" });
  }
});

export default router;
