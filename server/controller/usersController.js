const User = require("../../database/models/user");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const searchedUser = await User.find({ _id: id, user: req.userId });
    if (searchedUser) {
      res.json(searchedUser);
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
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

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json(user);
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error("Error on delete the user");
    error.code = 500;
    next(error);
  }
};

module.exports = { getUsers, updateUser, deleteUser, getUserById };
