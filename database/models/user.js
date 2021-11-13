const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default:
      "https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-14.png",
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: [Types.ObjectId],
      ref: "User",
    },
  ],
  enemies: [
    {
      type: [Types.ObjectId],
      ref: "User",
    },
  ],
  age: {
    type: Number,
    required: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
