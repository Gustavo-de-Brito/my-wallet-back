import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

const mongoCLient = new MongoClient(process.env.MONGO_DB_URI);
let db;

mongoCLient.connect().then(() => {
  db = mongoCLient.db(process.env.MONGO_DB_NAME);
});

// clients route

app.post("/clients", async (req, res) => {
  const newUser = req.body;

  res.sendStatus(201);
});

app.listen(process.env.PORT, () => {
  console.log("running server...");
});