const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/config/swagger");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const UsersRoutes = require("./src/routes/users");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

// Route Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Connexion à la base de données
connectDB();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware CORS
app.use(
  cors({
    origin: "*", // Ou mieux : ['http://localhost:4200'] en développement
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// Routes
app.use("/users", UsersRoutes);

// Gestion des routes non trouvées (404)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Middleware Global pour gérer les erreurs
app.use(errorHandler);

module.exports = app;
