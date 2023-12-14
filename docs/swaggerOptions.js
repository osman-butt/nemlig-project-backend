import swaggerJSDoc from "swagger-jsdoc";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000/api/v1";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Exam Ecommerce API",
      version: "1.0.0",
      description: "An Express Ecommerce API",
    },
    servers: [
      {
        url: FRONTEND_URL,
      },
    ],
  },
  apis: ["./docs/*.js"],
};

const specs = swaggerJSDoc(options);

export default specs;
