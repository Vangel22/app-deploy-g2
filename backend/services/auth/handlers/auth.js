const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  validate,
  AccountReset,
  AccountSignUp,
  AccountLogin,
} = require("../../../pkg/accounts/validate");
const accounts = require("../../../pkg/accounts");
const config = require("../../../pkg/config");

const login = async (req, res) => {
  try {
    await validate(req.body, AccountLogin);
    const { email, password } = req.body;

    const account = await accounts.getByEmail(email);

    if (!account) {
      return res.status(400).send("Account not found!");
    }

    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).send("Incorrect password!");
    }

    const payload = {
      fullname: account.fullname,
      email: account.email,
      id: account._id,
      exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
    };

    const token = jwt.sign(payload, config.getSection("security").jwt_secret);
    return res.status(200).send(token);
  } catch (err) {
    console.error(err);
    return res.status(err.status).send(err.error);
  }
};

const register = async (req, res) => {
  try {
    await validate(req.body, AccountSignUp);
    const exists = await accounts.getByEmail(req.body.email);
    if (exists) {
      return res.status(400).send("Account with this email already exists!");
    }
    req.body.password = bcrypt.hashSync(req.body.password);
    const acc = await accounts.create(req.body);
    return res.status(201).send(acc);
  } catch (err) {
    console.log(err);
    return res.status(err.status).send(err.error);
  }
};

const refreshToken = async (req, res) => {
  const payload = {
    ...req.auth,
    exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
  };
  const token = jwt.sign(payload, config.getSection("security").jwt_secret);
  return res.status(200).send(token);
};

const forgotPassword = async () => {};

const resetPassword = async (req, res) => {
  await validate(req.body, AccountReset);
  const { new_password, old_password, email } = req.body;

  const userAccount = await accounts.getByEmail(email);

  if (!bcrypt.compareSync(old_password, userAccount.password)) {
    return res.status(400).send("Incorrect password!");
  }

  const newPasswordHashed = bcrypt.hashSync(new_password);

  if (old_password === new_password) {
    return res.status(400).send("New password cannot be old password");
  }

  const userPassChanged = await accounts.setNewPassword(
    userAccount._id.toString(),
    newPasswordHashed
  );

  return res.status(200).send(userPassChanged);
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  refreshToken,
};
