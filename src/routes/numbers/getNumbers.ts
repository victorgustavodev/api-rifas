import { Router } from "express";
const router = Router();
import userModel from "../../database/models/users";

router.get("/:userPhone", async (req, res) => {
  let { userPhone } = req.params;
  
  if (!userPhone) {
    return res.status(400).json({
      "en-message": "Invalid amounteters",
      "pt-br-message": "Parâmetros inválidos",
    });
  }

  const userSchema = await userModel.findOne({ phoneNumber: userPhone });
  if (!userSchema) {
    return res.status(404).json({
      "en-message": "User not found",
      "pt-br-message": "Usuário não encontrado",
    });
  }

  const Numbers = userSchema.Numbers.map((x) => {
    return {
      image: x.image,
      name: x.Rifa,
      numbers: x.myNumbers,
      premiedNumbers: x.myNumbersPremied,
    };
  });

  res.json(Numbers);
});
export default router;
