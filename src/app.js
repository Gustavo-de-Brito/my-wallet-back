import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import transactionsRouter from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use(authRouter);

app.use(transactionsRouter);

// auth routes

app.listen(process.env.PORT, () => {
  console.log("running server...");
});