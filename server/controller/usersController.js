const User = require("../../database/models/user");

const getUsers = async (req, res) => {
  const pets = await User.find();
  res.json(pets);
};

const updateUser = async (req, res, next) => {
  const user = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(user.id, user, {
      new: true,
    });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error("Wrong id format");
    error.code = 400;
    next(error);
  }
};
