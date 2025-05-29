const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the erreur dans la console pour le debugging

  const statusCode = err.status || 500; // Définit le code d'erreur (500 par défaut)
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // Cache le stack trace en prod
  });
};

module.exports = errorHandler;
