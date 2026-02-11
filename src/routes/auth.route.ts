import {Router} from "express";
import { register } from "../controller/auth.controller.js";

const authRoute = Router();
authRoute.post("/register", register);

export default authRoute;
