const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  todos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todos",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Userschema.pre("save", async function (next) {
  //hash user password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", Userschema);
