import { Router } from "express";
import { verify } from "../middleware/auth.middleware.js";
import { createOrder } from "../controller/order.controller.js";

const orderRoute = Router();
orderRoute.use(verify);
orderRoute.post("/", createOrder);
export default orderRoute;
