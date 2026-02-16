import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "API documentation for Ecommerce project",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
    components: {
      schemas: {
        RegisterInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "juan123" },
            email: { type: "string", example: "juan@example.com" },
            password: { type: "string", example: "123456" },
            role: { type: "string", example: "USER" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "juan@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            username: { type: "string", example: "juan123" },
            email: { type: "string", example: "juan@example.com" },
            role: { type: "string", example: "USER" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Successful login",
            },
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                email: { type: "string", example: "juan@email.com" },
                role: { type: "string", example: "USER" },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "This user already exists",
            },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "fail",
            },
            location: {
              type: "string",
              example: "body",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: {
                    type: "string",
                    example: "username",
                  },
                  message: {
                    type: "string",
                    example: "The username must be at least 3 characters long.",
                  },
                },
              },
            },
          },
        },
        LogoutResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Successful session closure",
            },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
          description: "HttpOnly JWT authentication cookie",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts","./src/docs/*.ts"],
});
