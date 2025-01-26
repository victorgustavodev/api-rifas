import { Router } from "express";
const router = Router();
import usersModel from "../../database/models/users";

router.post("/", async (req, res) => {
  try {
    const { nome, email, phone } = req.body;
    
    if (!nome || !email || !phone) {
      return res.status(400).json({
        "en-message": "Invalid amounteters",
        "pt-br-message": "Parâmetros inválidos",
      });
    }

    const userSchema = await usersModel.findOne({ phoneNumber: phone });

    if (userSchema) {
      return res.status(409).json({
        "en-message": "User already exists",
        "pt-br-message": "Usuário já existe",
      });
    }

    new usersModel({
      nome,
      email,
      phoneNumber: phone,
    }).save();

    res.status(201).json({
      "en-message": "User successfully created",
      "pt-br": "Usuário criado com sucesso.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ "error-message": "An error has occurred" });
  }
});

export default router;
