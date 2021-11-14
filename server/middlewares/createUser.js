const bcrypt = require("bcrypt");
const User = require("../../database/models/user");

const createUser = async (req, res, next) => {
  const { name, username, password, age, image = req.file } = req.body;
  try {
    const user = await User.create({
      name,
      username,
      password: await bcrypt.hash(password, 10),
      age,
      image,
    });
    res.status(201).json(user);
  } catch {
    const error = new Error("Bad credentials provided");
    error.code = 400;
    next(error);
  }
};

module.exports = createUser;
