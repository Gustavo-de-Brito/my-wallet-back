import { db } from "../databases/mongo.js";

async function tokenValidation(req, res, next) {
  const { token } = req.headers;

  try {
    const isValidToken = await db.collection("sessions").findOne({token: token});
  
    if(!isValidToken) {
      return res.sendStatus(401);
    }
  
    next();
  } catch(err) {
    res.sendStatus(500);
  }
}

export default tokenValidation;