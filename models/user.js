// user schema
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { conndbaccounts } = require("../db_connect");

const UserSchema = Schema({
  email: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password too short"],
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "User", "Researcher"],
    default: "User",
  },
  group: { type: String, required: true, default: "None" },
  signupDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return candidatePassword == this.password;
};

UserSchema.statics.getAuthenticated = async function (email, password) {
  try {
    const users = await this.find({ email: email });
    // make sure the user exists
    if (!users) {
      throw new Error("User not found");
    }
    if (users.lenght == 0) {
      throw new Error("User not found");
    }
    let user = users[0];
    // test for a matching password
    try {
      let isMatch = user.comparePassword(password);
      if (isMatch) {
        user.lastLogin = Date.now();
        try {
          await user.save();
          return user;
        } catch (err) {
          throw new Error(err.toString());
        }
      }
      throw new Error("Password incorrect");
    } catch (err) {
      throw new Error(err.toString());
    }
  } catch (err) {
    throw new Error(err.toString());
  }
};

module.exports = conndbaccounts.model("User", UserSchema);
// we need to export the model so that it is accessible in the rest of the app
