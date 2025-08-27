const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const swaggerDocument = require("./src/config/swagger.js");
const UsersRoutes = require("./src/routes/users");
const path = require("path");

const app = express();

// --- MIDDLEWARES GLOBAUX ---
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SERVIR LES FICHIERS STATIQUES DE SWAGGER ---
app.use(
  "/api-docs",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);
app.use(
  "/api-docs",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/absolute-path")
  )
);

// --- ROUTES ---
app.get("/", (req, res) => {
  res.json({ success: true, message: "Bienvenue sur l'API Digitalab 🚀" });
});

// Route Swagger - MAINTENANT ça va fonctionner
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- CONNEXION DB ---
connectDB().catch((error) => {
  console.error("❌ Database connection failed:", error.message);
});

// --- ROUTES API ---
app.use("/users", UsersRoutes);

// --- GESTION DES ERREURS ---
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
