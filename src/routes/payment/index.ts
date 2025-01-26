import { Payment, MercadoPagoConfig } from "mercadopago";
import { Router } from "express";
const router = Router();
import productModel from "../../database/models/products";
import usersModel from "../../database/models/users";
import axios from "axios";

router.post("/:id", async (req, res) => {
  const { ammount, phone, name, email } = req.body;
  const { id } = req.params;
  const productSchema = await productModel.findOne({ _id: id });

  if (!productSchema) {
    return res.status(404).json({
      "en-message": "Product not found",
      "pt-br-message": "Produto não encontrado",
    });
  }

  const userExists = await usersModel.findOne({ phoneNumber: phone });
  if (!userExists) {
    await new usersModel({
      nome: name,
      email: email,
      phoneNumber: phone,
      Numbers: [
        {
          image: productSchema.image, // Use o ID do produto ou outro valor apropriado
          Rifa: productSchema.name,
          myNumbers: [],
          myNumbersPremied: [],
        },
      ],
    }).save();
  } else {
    const hasRifa = userExists.Numbers.some(
      (n) => n.Rifa === productSchema.name
    );
    if (!hasRifa) {
      userExists.Numbers.push({
        image: productSchema.image,
        Rifa: productSchema.name,
        myNumbers: [],
        myNumbersPremied: [],
      });
      await userExists.save();
    }
  }

  const price = Number(productSchema.price) * Number(ammount);

  const body = {
    transaction_amount: Number(price),
    description: `Pagamento Gerado | ${email}`,
    payment_method_id: "pix",
    payer: {
      first_name: `${name}`,
      email: `${email}`,
      phone: {
        number: `${phone}`,
      },
    },
  };

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACESS_TOKEN,
  });
  const payment = new Payment(client);

  payment
    .create({ body })
    .then(async function (data) {
      const copyAndPaste = data.point_of_interaction.transaction_data.qr_code;

      res.json({
        rifas: data.transaction_amount / productSchema.price,
        price: `${data.transaction_amount}`,
        paymentId: `${data.id}`,
        status: `${data.status}`,
        qrCode: `${data.point_of_interaction.transaction_data.qr_code_base64}`,
        copyAndPaste: `${copyAndPaste}`,
        dateExpiration: data.date_of_expiration,
      });

      const intervalId = setInterval(async function () {
        try {
          const response = await axios.get(
            `https://api.mercadolibre.com/collections/notifications/${data.id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.MP_ACESS_TOKEN}`,
              },
            }
          );
          if (response.data.collection.status === "approved") {
            // console.log("Pagamento aprovado");
            clearInterval(intervalId);

            const generateRandomNumber = (min, max, blacklist) => {
              let randomNumber;
              do {
                randomNumber =
                  Math.floor(Math.random() * (max - min + 1)) + min;
              } while (blacklist.includes(randomNumber));
              return randomNumber;
            };

            const generateRandomNumbers = (min, max, quantity, blacklist) => {
              const randomNumbers = new Set();
              while (randomNumbers.size < quantity) {
                const randomNumber = generateRandomNumber(min, max, blacklist);
                randomNumbers.add(randomNumber);
              }
              return Array.from(randomNumbers);
            };

            const quantity = ammount;
            const blacklistNumbers = productSchema.bilhetesBlacklist;
            const minBilhetes = productSchema.minBilhetes;
            const maxBilhetes = productSchema.totalBilhetes;

            const randomNumbers = generateRandomNumbers(
              minBilhetes,
              maxBilhetes,
              quantity,
              blacklistNumbers
            );

            const premiados = randomNumbers.filter((number) =>
              productSchema.bilhetesPremiados.includes(number)
            );

            // console.log("Números gerados:", randomNumbers);
            // console.log("Números premiados:", premiados);

            const userUpdateResult = await usersModel
              .updateOne(
                {
                  phoneNumber: phone,
                  "Numbers.Rifa": productSchema.name,
                  "Numbers.image": productSchema.image,
                },
                {
                  $push: {
                    "Numbers.$.myNumbers": { $each: randomNumbers },
                    "Numbers.$.myNumbersPremied": { $each: premiados },
                  },
                }
              )
              .lean();

            // console.log(
            //   "Resultado da atualização do usuário:",
            //   userUpdateResult
            // );

            const productUpdateResult = await productModel
              .findOneAndUpdate(
                { _id: id },
                {
                  $push: {
                    bilhetesBlacklist: { $each: randomNumbers },
                  },
                },
                { new: true }
              )
              .lean();

            // console.log(
            //   "Resultado da atualização do produto:",
            //   productUpdateResult
            // );
          }
        } catch {
          return;
        }
      }, 5000);
    })
    .catch((error) => {
      // console.log("Erro ao criar pagamento:", error);
      res.status(500).json({
        "en-message": "Internal Server Error",
        "pt-br-message": "Erro Interno do Servidor",
      });
    });
});

export default router;
