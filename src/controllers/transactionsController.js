import { db, objectId } from "../databases/mongo.js";

export async function transactionsController(req, res) {
  const userId = res.locals.userId;

  try {
    const transactions = await db.collection("transactions").findOne({ userId: userId });

    res.status(200).send(transactions ? transactions : {});
  } catch{
    res.sendStatus(500);
  }
}