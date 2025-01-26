import { Router } from "express";
const router = Router();
import productsModel from "../../database/models/products";

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productsSchema = await productsModel.findOne({ _id: productId });
    if (!productsSchema) {
      return res.status(404).json({
        "en-message": "Product not found",
        "pt-br-message": "Produto não encontrado",
      });
    }

    const Products = {
      _id: productsSchema._id,
      name: productsSchema.name,
      price: productsSchema.price,
      image: productsSchema.image,
      status: productsSchema.status,
      cotaPremiada: productsSchema.cotaPremiada,
      bilhetesPremiados: productsSchema.bilhetesPremiados,
      totalNumerosComprados: productsSchema.bilhetesBlacklist.length,
    };

    return res.json(Products);
  } catch {
    return res.status(404).json({
      "en-message": "Product not found",
      "pt-br-message": "Produto não encontrado",
    });
  }
});

export default router;
