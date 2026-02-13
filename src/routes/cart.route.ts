import { Router } from "express";
import { verify } from "../middleware/auth.middleware.js";
import {
  addProductToCart,
  emptyCart,
  removeProductFromCart,
} from "../controller/cart.controller.js";
import { validationSchema } from "../validation/schemaValidation.js";
import {
  addProductToCartValidation,
  cartParamsValidation,
} from "../validation/cart.validation.js";

const cartRoute = Router();
cartRoute.use(verify);

cartRoute.post(
  "/:id",
  validationSchema(cartParamsValidation, "params"),
  validationSchema(addProductToCartValidation, "body"),
  addProductToCart
);

cartRoute.delete(
  "/:id",
  validationSchema(cartParamsValidation, "params"),
  removeProductFromCart
);

cartRoute.delete("/", emptyCart);

export default cartRoute;
