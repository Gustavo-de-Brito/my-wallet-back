import joi from "joi";

function userValidation(req, res, next) {
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

  res.locals.newUser = newUser;

  next();
}

export default userValidation;