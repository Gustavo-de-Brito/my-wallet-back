import { db, objectId } from "../databases/mongo.js";

export async function getTransactions(req, res) {
  const userId = res.locals.userId;

  try {
    const userTransactions = await db.collection("transactions").findOne({ userId: userId });

    let transactionsData = {};

    if(userTransactions) {
      transactionsData = { 
        transactions: userTransactions.transactions,
        totalTransactions: (userTransactions.totalTransactions).toFixed(2)
      }; 
    }

    res.status(200).send(transactionsData);
  } catch{
    res.sendStatus(500);
  }
}

export async function addTransaction(req, res) {
  const userId = res.locals.userId;
  const transactionData = req.body;

  try{
    const userTransactions = await db.collection("transactions").findOne({ userId: objectId(userId) });

    const transactions = [
      ...userTransactions.transactions,
      {
        ...transactionData,
        value: transactionData.value.toFixed(2),
        id: new Date().getTime()
      }
    ];
    let updatedTotal;

    if(transactionData.type === "entrace") {
      updatedTotal = userTransactions.totalTransactions + transactionData.value;
    } else {
      updatedTotal = userTransactions.totalTransactions - transactionData.value;
    }

    await db
    .collection("transactions")
    .updateOne(
      {
        userId: objectId(userId),
      },
      {
        $set: { totalTransactions: updatedTotal, transactions: transactions }
      }       
    )

    res.sendStatus(201);

  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}