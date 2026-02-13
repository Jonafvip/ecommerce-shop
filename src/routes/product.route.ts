import { Router } from "express";
import { verify, isAdmin } from "../middleware/auth.middleware.js";
import {
  createProducts,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { validationSchema } from "../validation/schemaValidation.js";
import {
  deleteProductValidation,
  updateProductValidation,
  CreateProductValidation,
} from "../validation/product.validation.js";

const productRoute = Router();

productRoute.use(verify, isAdmin);
productRoute.post(
  "/",
  validationSchema(CreateProductValidation),
  createProducts
);
productRoute.put(
  "/:id",
  validationSchema(updateProductValidation, "params"),
  updateProduct
);
productRoute.delete(
  "/:id",
  validationSchema(deleteProductValidation, "params"),
  deleteProduct
);

export default productRoute;
