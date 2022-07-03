import bcrypt from "bcrypt";
import { db, objectId } from "../databases/mongo.js";

export async function signUp(req, res) {
  const newUser = res.locals.newUser;

  try {
    const registeredEmail = await db.collection("users").findOne({ email: newUser.email });
    
    if(registeredEmail) {
      return res.status(409).send("Email já cadastrado");
    }
    
    const encryptedPassword = bcrypt.hashSync(newUser.password, 10);
    
    await db.collection("users").insertOne({...newUser, password: encryptedPassword});
    // create a collection to keep user transactions
    const userData = await db.collection("users").findOne({ email: newUser.email });
    await db
    .collection("transactions")
    .insertOne({ userId: objectId(userData._id), transactions: [], totalTransactions: 0});

    res.sendStatus(201);
  } catch(err) {
    res.sendStatus(500);
  }
}

export async function login(req, res)  {
  const token = res.locals.token;
  const userName = res.locals.user.name;

  res.status(200).send({ token, userName });
}