import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from 'body-parser';
import morgan from "morgan";
import { config } from "dotenv";
import route from "./src/Routes/index.js";
import verifyToken from "./src/middleware/verifyToken.js";
import { serve, setup } from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import schedule from 'node-schedule';
import userController from "./src/Controllers/userController.js";


config();

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
schedule.scheduleJob('* * * * *', userController.deleteUnverifiedUsers);
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
  apis: ["./src/Routes/*.js"], // Đường dẫn đến các file chứa API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", serve, setup(swaggerSpec));
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(swaggerJsdoc, null, 2));
});
console.log(`Docs available at http://localhost:${process.env.PORT}/api-docs`);
app.listen(process.env.PORT, () => {
  console.log("App is listening in url http://localhost:" + process.env.PORT);
});
