import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Express API with TypeScript",
    description: "Auto-generated Swagger documentation",
    version: "1.0.0",
  },
  host: "localhost:8080", // Change if needed
  schemes: ["http"],
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/routes/**/*.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated!");
  require("./index"); // Start the server after generation
});
