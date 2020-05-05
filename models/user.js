const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

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
  resetPasswordExpire: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Userschema.pre("save", async function (next) {
  if(!this.isModified('password')){
      next();
  }
  //hash user password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//generate a token for user to reset password
Userschema.methods.token = function(){
  const token = crypto.randomBytes(20).toString('hex');
  //hash token
  this.resetPasswordToken = crypto.createHash('sha256')
  .update(token)
  .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return token;
}

module.exports = mongoose.model("User", Userschema);
