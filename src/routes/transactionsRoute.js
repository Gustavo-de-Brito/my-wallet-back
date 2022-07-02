import { Router } from "express";
import { transactionsController } from "../controllers/transactionsController.js";
import tokenValidation from "../middlewares/tokenValidation.js";

const router = Router();

router.get("/transactions", tokenValidation, transactionsController);

export default router;