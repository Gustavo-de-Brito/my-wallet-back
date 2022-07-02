import bcrypt from "bcrypt";
import { db } from "../databases/mongo.js";

export async function signUp(req, res) {
  const newUser = res.locals.newUser;

  try {
    const registeredEmail = await db.collection("users").findOne({ email: newUser.email });

    if(registeredEmail) {
      return res.status(409).send("Email já cadastrado");
    }

    const encryptedPassword = bcrypt.hashSync(newUser.password, 10);

    await db.collection("users").insertOne({...newUser, password: encryptedPassword});

    res.sendStatus(201);
  } catch(err) {
    res.sendStatus(500);
  }
}

export async function login(req, res)  {
  const token = res.locals.token;

  res.status(200).send({ token });
}