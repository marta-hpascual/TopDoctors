// Diagnosis schema
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Patient = require("./patient");
const { conndbdata } = require("../db_connect");
const DiagnosisSchema = Schema({
  date: { type: Date, default: Date.now },
  diagnosis: { type: String, require: true },
  prescription: { type: String, default: "" },
  createdBy: { type: Schema.Types.ObjectId, ref: "Patient" },
});
module.exports = conndbdata.model("Diagnosis", DiagnosisSchema);
