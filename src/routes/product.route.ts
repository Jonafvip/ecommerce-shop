import { Router } from "express";
import { verify, isAdmin } from "../middleware/auth.middleware.js";
import { createProducts } from "../controller/product.controller.js";

const productRoute = Router();

productRoute.use(verify, isAdmin);
productRoute.post("/", createProducts);

export default productRoute;
