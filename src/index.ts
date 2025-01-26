import * as dotenv from "dotenv";
dotenv.config();
import routers from "./routes/router";
import cors from "cors";
import { corsOptions } from "./middlewares/cors/options";
import express, { Response, Request, Next } from "express";
import { mongoConnect } from "./database/index";
mongoConnect();

const app = express();

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ limit: '200kb', extended: true }));

app.use(
  cors({
    origin: corsOptions,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", routers);

app.use(function (req: Request, res: Response, next: Next) {
  res.status(404).json({ error: "Route not found" });
  next();
});

app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.clear();
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 3333}`
  );
});
