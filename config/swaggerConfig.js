const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
    definition: {
        openapi: "3.0.0", // OpenAPI version
        info: {
            title: "My API Documentation",
            version: "1.0.0",
            description: "This is the API documentation for my Node.js app.",
        },
        servers: [
            {
                url: "http://localhost:8080", // Change as per your setup
                description: "Local Server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to API docs (adjust based on your project)
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
