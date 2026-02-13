import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller.js";
import {
  registerValidation,
  validationSchema,
} from "../validation/auth.validation.js";

const authRoute = Router();
authRoute.post("/register", validationSchema(registerValidation), register);
authRoute.post("/login", login);
authRoute.post("/logout", logout);

export default authRoute;
