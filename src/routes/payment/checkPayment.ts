import { Router } from "express";
const router = Router();
import axios from "axios";

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(
      `https://api.mercadolibre.com/collections/notifications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACESS_TOKEN}`,
        },
      }
    );
    res.json(data.collection);
  } catch (error) {
    console.log(error);
    if (error.response.status === 404) {
      return res.status(404).json({ status: "Payment not found" });
    }
  }
});
export default router;
