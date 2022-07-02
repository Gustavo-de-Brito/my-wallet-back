import { db, objectId } from "../databases/mongo.js";

async function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const validToken = await db.collection("sessions").findOne({ token });

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