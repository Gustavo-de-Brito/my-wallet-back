import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoCLient = new MongoClient(process.env.MONGO_DB_URI);
let db;

mongoCLient.connect(() => {
  db = mongoCLient.db(process.env.MONGO_DB_NAME);
});

const objectId = ObjectId;

export { db, objectId };