import { Router } from "express";
import { verify } from "../middleware/auth.middleware.js";
import {
  addProductToCart,
  removeProductFromCart,
} from "../controller/cart.controller.js";

const cartRoute = Router();
cartRoute.use(verify);
cartRoute.post("/:id", addProductToCart);
cartRoute.delete("/:id", removeProductFromCart);

export default cartRoute;
