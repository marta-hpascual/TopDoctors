module.exports = {
  client_server: "http://localhost:3000",
  port: 3000,
  dbaccounts:
    "mongodb://root:rootpsw@mongo-accounts:27017/db-accounts?authSource=admin",
  dbdata: "mongodb://root:rootpsw@mongo-data:27017/db-data?authSource=admin",
  SECRET_TOKEN: "AG-AG?f873hkJ9J", // jwt secret token
  SECRET_KEY_CRYPTO: ".B763y%%~me-f?q", // secret key for crypto library
};
