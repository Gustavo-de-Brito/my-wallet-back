import joi from "joi";

function transactionValidation(req, res, next) {
  const transactionData = req.body;

  const dateRegex = /^[0-9]{2}\/[0-9]{2}/;

  const transactionSchema = joi.object(
    {
      value: joi.number().required(),
      date: joi.string().pattern(dateRegex).required(),
      description: joi.string().required(),
      type: joi.string().valid("entrace", "exit").required()
    }
  );

  const { error } = transactionSchema.validate(transactionData);

  if(error) {
    return res.sendStatus(422);
  }

  next();
}

export default transactionValidation;