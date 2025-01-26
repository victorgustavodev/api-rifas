import { Router } from "express";
import Product from "../../database/models/products";

const router = Router();

router.get("/:amount", async (req, res) => {
  try {
    const { amount } = req.params;
    const query = Product.find()
      .sort({ status: -1 })
      .limit(parseInt(amount, 10) || 0);

    const products = await query
      .select([
        "_id",
        "createdAt",
        "name",
        "image",
        "status",
        "price",
        "cotaPremiada",
        "bilhetesPremiados",
        "bilhetesBlacklist",
        "totalBilhetes",
      ])
      .lean();

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
