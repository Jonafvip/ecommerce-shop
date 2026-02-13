import { Router } from "express";
import { verify, isAdmin } from "../middleware/auth.middleware.js";
import {
  createProducts,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";

const productRoute = Router();

productRoute.use(verify, isAdmin);
productRoute.post("/", createProducts);
productRoute.put("/:id", updateProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;
