import { config } from "dotenv";
config();
import express from "express";
import authRoute from "./routes/auth.route.js";
import productRoute from './routes/product.route.js'
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

//Rutas
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin/product",productRoute)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
