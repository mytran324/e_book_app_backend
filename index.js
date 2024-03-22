const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const route = require("./routes/index");
const verifyToken = require("./middleware/verifyToken");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (req.path !== "/api/admin/login" && !req.path.startsWith("/api-docs")) {
    verifyToken(req, res, next);
  } else {
    next();
  }
});
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "team11_ebook",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

app.use("/api", route);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for your API endpoints",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Routes/*.js"], // Đường dẫn đến các file chứa API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(swaggerDocs, null, 2));
});
console.log(`Docs available at http://localhost:${process.env.PORT}/api-docs`);
app.listen(process.env.PORT, () => {
  console.log("App is listening in url http://localhost:" + process.env.PORT);
});
