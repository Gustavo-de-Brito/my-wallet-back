import { db, objectId } from "../databases/mongo.js";

async function tokenValidation(req, res, next) {
  const { token } = req.headers;

  try {
    const validToken = await db.collection("sessions").findOne({token: token});
  
    if(!validToken) {
      return res.sendStatus(401);
    }

    res.locals.userId = objectId(validToken.userId);

    next();
  } catch(err) {
    res.sendStatus(500);
  }
}

export default tokenValidation;