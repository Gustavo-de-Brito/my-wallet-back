import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

const mongoCLient = new MongoClient(process.env.MONGO_DB_URI);
let db;

mongoCLient.connect().then(() => {
  db = mongoCLient.db(process.env.MONGO_DB_NAME);
});

// sign-up route

app.post("/sign-up", async (req, res) => {
  const newUser = req.body;

  // password must have at least: 1 number, 1 lowercase character,
  // 1 uppercase character, 1 special character, at least 8 characters
  // at most 30 characters
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,30}$/;

  const userSchema = joi.object(
    {
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().pattern(passwordRegex)
    }
  );

  const { error } = userSchema.validate(newUser);

  if(error) {
    return res.sendStatus(422);
  }

  try {
    const encryptedPassword = bcrypt.hashSync(newUser.password, 10);

    await db.collection("users").insertOne({...newUser, password: encryptedPassword});

    res.sendStatus(201);
  } catch(err) {
    res.sendStatus(500);
  }
});

// login route

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({email: email});
    // password will only be check if the user is found
    const isRightpassword = user ? bcrypt.compareSync(password, user.password) : false;

    if(!user || !isRightpassword) {
      return res.status(401).send("Senha ou Email incorreto(a)");
    }

    const token = uuid();

    const tokenUser = await db.collection("sessions").findOne({ userId: ObjectId(user._id) });

    if(tokenUser) {
      await db.collection("sessions").updateOne(
        {
          userId: ObjectId(user._id)
        },
        {
          $set: { token: token }
        }
      );
    } else {
      await db.collection("sessions").insertOne({ userId:ObjectId(user._id), token });
    }

    res.status(200).send({ token });
  } catch(err) {
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () => {
  console.log("running server...");
});