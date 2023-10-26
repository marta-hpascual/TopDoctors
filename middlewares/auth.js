"use strict";

const serviceAuth = require("../services/auth");

function isAuth(roles) {
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      return res
        .status(403)
        .send({ message: "It does not have authorization" });
    }

    const token = req.headers.authorization.split(" ")[1];
    let method = req.method;
    await serviceAuth
      .decodeToken(token, method, roles)
      .then((response) => {
        req.user = response;
        next();
      })
      .catch((response) => {
        return res.status(response.status).send({ message: response.message });
      });
  };
}

module.exports = isAuth;
