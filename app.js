const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const swaggerDocument = require("./src/config/swagger.js");
const UsersRoutes = require("./src/routes/users");

const app = express();

// --- 1. MIDDLEWARES GLOBAUX (à déclarer en premier) ---

// Connexion à la base de données
connectDB();

// Middleware CORS : Le plus haut possible pour s'appliquer à toutes les requêtes.
app.use(
  cors({
    origin: "*", // Idéalement, remplacez '*' par l'URL de votre frontend en production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

// Logger les requêtes
app.use(morgan("dev"));

// Parsing du corps des requêtes (remplace bodyParser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. ROUTES DE L'APPLICATION ---

// Route d'accueil
app.get("/", (req, res) => {
  res.json({ success: true, message: "Bienvenue sur l'API Digitalab 🚀" });
});

// Route Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes principales de l'API
app.use("/users", UsersRoutes);

// --- 3. GESTION DES ERREURS (à déclarer en dernier) ---

// Gestion des routes non trouvées (404)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Middleware Global pour gérer toutes les autres erreurs
app.use(errorHandler);

module.exports = app;
