"use strict";

const mongoose = require("mongoose");
const config = require("./config");

const conndbaccounts = mongoose.createConnection(config.dbaccounts, {
  useNewUrlParser: true,
});
const conndbdata = mongoose.createConnection(config.dbdata, {
  useNewUrlParser: true,
});

module.exports = {
  conndbaccounts,
  conndbdata,
};
