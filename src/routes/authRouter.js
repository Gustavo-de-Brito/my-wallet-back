import { Router } from "express";
import { signUp, login } from "../controllers/authControllers.js";
import userValidation from "../middlewares/userValidation.js";
import loginValidation from "../middlewares/loginValidation.js";
import isRegisteredToken from "../middlewares/isRegisteredToken.js";

const router = Router();

router.post("/sign-up", userValidation, signUp);

router.post("/login", loginValidation, isRegisteredToken, login);

export default router;