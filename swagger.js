const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "TOPDoctors API",
    description: "Documentation for the API exposed.",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Users",
      description: "Endpoints",
    },
    {
      name: "Groups",
      description: "Endpoints",
    },
    {
      name: "Patients",
      description: "Endpoints",
    },
    {
      name: "Diagnosis",
      description: "Endpoints",
    },
  ],
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header",
    },
    petstore_auth: {
      type: "oauth2",
      authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
      flow: "implicit",
      scopes: {
        read_pets: "read your pets",
        write_pets: "modify pets in your account",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index"); // Your project's root file
});
