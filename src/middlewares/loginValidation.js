import bcrypt from "bcrypt";
import joi from "joi";
import { db } from "../databases/mongo.js";

async function loginValidation(req, res, next) {
  const { email, password } = req.body;

  const loginSchema = joi.object(
    {
      email: joi.string().email().required(),
      password: joi.string().required(),
    }
  )

  const { error } = loginSchema.validate({ email, password });

  if(error) {
    return res.sendStatus(422);
  }

  try {
    const user = await db.collection("users").findOne({email: email});
    // password will only be check if the user is found
    const isRightpassword = user ? bcrypt.compareSync(password, user.password) : false;
    
    if(!user || !isRightpassword) {
      return res.status(401).send("Senha ou Email incorreto(a)");
    }
  
    res.locals.user = user;
  
    next();
  } catch(err) {
    res.sendStatus(500);
  }
}

export default loginValidation;