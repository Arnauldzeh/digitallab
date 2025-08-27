const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const swaggerDocument = require("./src/config/swagger.js");
const UsersRoutes = require("./src/routes/users");
const path = require("path");
const fs = require("fs");

const app = express();

// --- MIDDLEWARES GLOBAUX ---
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SERVIR LES FICHIERS SWAGGER DEPUIS CDN ---
app.get("/api-docs/swagger-ui.css", (req, res) => {
  res.redirect(
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css"
  );
});

app.get("/api-docs/swagger-ui-bundle.js", (req, res) => {
  res.redirect(
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"
  );
});

app.get("/api-docs/swagger-ui-standalone-preset.js", (req, res) => {
  res.redirect(
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"
  );
});

// --- ROUTES ---
app.get("/", (req, res) => {
  res.json({ success: true, message: "Bienvenue sur l'API Digitalab 🚀" });
});

// --- SWAGGER UI AVEC CDN ---
const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customCssUrl: "/api-docs/swagger-ui.css",
  customJs: [
    "/api-docs/swagger-ui-bundle.js",
    "/api-docs/swagger-ui-standalone-preset.js",
  ],
};

app.use("/api-docs", swaggerUi.serveFiles(swaggerDocument, swaggerOptions));
app.get("/api-docs", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>DIGITALAB API Documentation</title>
      <link rel="stylesheet" href="/api-docs/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="/api-docs/swagger-ui-bundle.js"></script>
      <script src="/api-docs/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerDocument)},
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout"
          });
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

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
