import { config } from "dotenv";
config();
import express from "express";
import authRoute from "./routes/auth.route.js";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
