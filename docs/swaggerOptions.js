import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ecommerce API",
            version: "1.0.0",
            description: "A simple Express Ecommerce API",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
            },
        ],
    },
    apis: ["./docs/*.js"],
}

const specs = swaggerJSDoc(options);

export default specs;