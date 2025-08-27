const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const swaggerDocument = require("./src/config/swagger.js");
const UsersRoutes = require("./src/routes/users");

const app = express();

// --- 1. MIDDLEWARES GLOBAUX ---

// Middleware CORS
app.use(
  cors({
    origin: "*",
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

// Parsing du corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. SWAGGER EN PREMIER (Indépendant de la DB) ---

// Route d'accueil
app.get("/", (req, res) => {
  res.json({ success: true, message: "Bienvenue sur l'API Digitalab 🚀" });
});

// Route Swagger - AVANT la connexion DB
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- 3. CONNEXION DB AVEC GESTION D'ERREURS ---

// Connexion à la base de données AVEC catch
connectDB().catch((error) => {
  console.error("❌ Database connection failed:", error.message);
  // Ne pas crash l'application, mais logger l'erreur
});

// --- 4. ROUTES DE L'API ---

app.use("/users", UsersRoutes);

// --- 5. GESTION DES ERREURS ---

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
