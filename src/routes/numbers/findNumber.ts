import { Router } from "express";
import User from "../../database/models/users";

const router = Router();

router.get("/:number", async (req: any, res: any) => {
  const { number } = req.params;
  
  if (!number) {
    return res.status(400).json({
      "en-message": "Invalid parameters",
      "pt-br-message": "Parâmetros inválidos",
    });
  }

  try {
    const foundUser = await User.findOne({
      $or: [
        { "Numbers.myNumbers": { $in: [Number(number)] } },
        { "Numbers.myNumbersPremied": { $in: [Number(number)] } },
      ],
    });

    if (!foundUser) {
      return res.status(404).json({
        "en-message": "User not found",
        "pt-br-message": "Usuário não encontrado",
      });
    }

    const response = {
      _id: foundUser._id,
      name: foundUser.nome,
      email: foundUser.email,
      phone: foundUser.phoneNumber,
      Rifas: foundUser.Numbers.map((numObj: any) => ({
        name: numObj.Rifa,
        numbers: numObj.myNumbers,
        premiedNumbers: numObj.myNumbersPremied,
      })),
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
