/*
 * EXPRESS CONFIGURATION FILE
 */
"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const app = express();
const api = require("./routes");
const path = require("path");
//CORS middleware
const crypt = require("./services/crypt");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

function setCrossDomain(req, res, next) {
  //instead of * you can define ONLY the sources that we allow.
  res.header("Access-Control-Allow-Origin", "*");
  //http methods allowed for CORS.
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(setCrossDomain);

// use the forward slash with the module api api folder created routes
app.use("/api", api);

module.exports = app;
