import { config } from "dotenv";
config();
import express from "express";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//Rutas
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/auth/cart", cartRoute);
app.use("/api/v1/auth/orderCart", orderRoute);
app.use("/api/v1/admin/product", productRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
