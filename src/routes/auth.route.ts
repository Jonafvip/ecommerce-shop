import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller.js";
import {
  loginValidation,
  registerValidation,
} from "../validation/auth.validation.js";
import { validationSchema } from "../validation/schemaValidation.js";

const authRoute = Router();
authRoute.post("/register", validationSchema(registerValidation), register);
authRoute.post("/login", validationSchema(loginValidation), login);
authRoute.post("/logout", logout);

export default authRoute;
