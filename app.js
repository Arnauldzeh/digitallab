const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const swaggerDocument = require("./src/config/swagger.js");
const UsersRoutes = require("./src/routes/users");

const app = express();

// --- MIDDLEWARES GLOBAUX ---
// Ces middlewares sont toujours chargés au début, quel que soit l'état de la DB.
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ACCESSIBLES AVANT LA CONNEXION DB ---
// Les routes qui n'ont pas besoin de la base de données peuvent être ici.
// Par exemple, la route de bienvenue et la documentation Swagger.
app.get("/", (req, res) => {
  res.json({ success: true, message: "Bienvenue sur l'API Digitalab 🚀" });
});

// --- SWAGGER UI AVEC CDN ---
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", (req, res) => {
  res.send(
    swaggerUi.generateHTML(swaggerDocument, {
      customCssUrl:
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
      customJs: [
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js",
      ],
    })
  );
});

// --- Fonction asynchrone pour démarrer le serveur après la connexion à la DB ---
const startServer = async () => {
  try {
    // --- CONNEXION DB ---
    // On attend que la connexion à la base de données soit établie.
    await connectDB();
    console.log("✅ Database connected successfully!");

    // --- ROUTES API QUI DÉPENDENT DE LA DB ---
    // Ces routes ne sont enregistrées qu'après une connexion réussie.
    app.use("/users", UsersRoutes);

    // --- GESTION DES ERREURS ---
    // Les middlewares de gestion d'erreurs sont les derniers à être enregistrés.
    app.use((req, res, next) => {
      const error = new Error("Not Found");
      error.status = 404;
      next(error);
    });
    app.use(errorHandler);
  } catch (error) {
    // Si la connexion à la DB échoue, on log l'erreur et on quitte le processus.
    console.error(
      "❌ Failed to start the server due to database connection issues:",
      error.message
    );
    process.exit(1); // Quitte l'application avec un code d'erreur
  }
};

// On appelle la fonction pour démarrer le serveur.
startServer();

module.exports = app;
