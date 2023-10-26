// Group schema
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { conndbaccounts } = require("../db_connect");

const GroupSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = conndbaccounts.model("Group", GroupSchema);
