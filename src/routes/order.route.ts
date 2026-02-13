import { Router } from "express";
import { verify } from "../middleware/auth.middleware.js";
import { createOrder } from "../controller/order.controller.js";
import { validationSchema } from "../validation/schemaValidation.js";
import { createOrderValidation } from "../validation/order.validation.js";

const orderRoute = Router();
orderRoute.use(verify);
orderRoute.post("/", validationSchema(createOrderValidation), createOrder);
export default orderRoute;
