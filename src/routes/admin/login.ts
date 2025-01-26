import jwt from "jsonwebtoken";
import { Router } from "express";
const router = Router();
import loginModel from "../../database/models/admin/login";

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      "en-message": "Invalid amounteters",
      "pt-br-message": "Parâmetros inválidos",
    });
  }
  
  const loginSchema = await loginModel.findOne({ username: username });
  if (!loginSchema || password !== loginSchema.password) {
    return res.status(400).json({
      "en-message": "Username and password are incorrect",
      "pt-br-message": "Usuário ou senha inválidos",
    });
  }

  const token = jwt.sign({ userId: username }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });

  res.json({ auth: true, token });
});

export default router;
