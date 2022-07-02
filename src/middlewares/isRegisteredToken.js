import { v4 as uuid } from "uuid";
import { db, objectId } from "../databases/mongo.js";

async function isRegisteredToken(req, res, next) {
  const user = res.locals.user;

  try{
    const token = uuid();
  
    const tokenUser = await db.collection("sessions").findOne({ userId: objectId(user._id) });
  
    if(tokenUser) {
      await db.collection("sessions").updateOne(
        {
          userId: objectId(user._id)
        },
        {
          $set: { token: token }
        }
        );
    } else {
      await db.collection("sessions").insertOne({ userId:objectId(user._id), token });
    }
  
    res.locals.token = token;
  
    next();
  } catch(err) {
    res.sendStatus(500);
  }
}

export default isRegisteredToken;