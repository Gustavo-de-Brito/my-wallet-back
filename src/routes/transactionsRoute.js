import { Router } from "express";
import { getTransactions, addTransaction } from "../controllers/transactionsController.js";
import tokenValidation from "../middlewares/tokenValidation.js";
import transactionValidation from "../middlewares/transactionValidation.js";

const router = Router();

router.get("/transactions", tokenValidation, getTransactions);

router.post("/transactions", tokenValidation, transactionValidation ,addTransaction);

export default router;