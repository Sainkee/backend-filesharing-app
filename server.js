import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./dbConnect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

dbConnect();

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
