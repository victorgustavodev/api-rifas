import { Router } from "express";
const router = Router();
import productsModel from "../../database/models/products";

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        "en-message": "Invalid amounteters",
        "pt-br-message": "Parâmetros inválidos",
      });
    }

    const productsSchema = await productsModel.findOne({ _id: id });
    if (!productsSchema) {
      return res.status(404).json({
        "en-message": "Product not found",
        "pt-br-message": "Produto não encontrado",
      });
    }

    await productsModel.deleteOne({ _id: id });
    return res.status(200).json({
      "en-message": "Product deleted",
      "pt-br-message": "Produto deletado",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ "error-message": "An error has occurred" });
  }
});

export default router;
