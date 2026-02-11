import express from "express";
import { config } from "dotenv";

config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
