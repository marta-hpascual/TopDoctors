// Patient schema
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const { conndbaccounts } = require("../db_connect");

const PatientSchema = Schema({
  name: String,
  lastName: String,
  email: String,
  phone: String,
  identifierDoc: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});
module.exports = conndbaccounts.model("Patient", PatientSchema);
