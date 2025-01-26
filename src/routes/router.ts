import jwtVerify from "../middlewares/jwt/jwtVerify";
import { Router } from "express";
const router = Router();

//Test Routes
import test from "./test/app";
router.use("/helloworld", test);

//Products routes
import getProduct from "./product/getProducts";
router.use("/getproducts", getProduct);
import putProduct from "./product/putProduct";
router.use("/updateproduct", jwtVerify, putProduct);
import deleteProduct from "./product/deleteProduct";
router.use("/deleteproduct", jwtVerify, deleteProduct);
import createProduct from "./product/createProduct";
router.use("/createproduct", jwtVerify, createProduct);
import findProduct from "./product/findProduct";
router.use("/findproducts", findProduct);

//User routes
import login from "./admin/login";
router.use("/login", login);
import getNumbers from "./numbers/getNumbers";
router.use("/getnumbers", getNumbers);
import findNumber from "./numbers/findNumber"
router.use("/findnumber", findNumber);
import createUser from "./users/createUser";
router.use("/users/createuser", createUser);
import payment from "./payment/index"
router.use("/payment", payment);
import checkPayment from "./payment/checkPayment"
router.use("/payment/check", checkPayment)
//Controllers
import auth from "../controllers/auth";
router.use("/auth", jwtVerify, auth);

export default router;
