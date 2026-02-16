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
import helmet from "helmet";
import { limiter, speedLimiter } from "./utils/limitRequets.utils.js";
import { errorHandler } from "./middleware/errorHandlerMiddleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger-docs.js";

export const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: [process.env.HOST_FRONTEND || "Unknown"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(limiter);
app.use(speedLimiter);
app.use(express.json({ limit: "10kb" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rutas
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/auth/cart", cartRoute);
app.use("/api/v1/auth/orderCart", orderRoute);
app.use("/api/v1/admin/product", productRoute);

app.use(errorHandler);
const PORT = process.env.PORT;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}
