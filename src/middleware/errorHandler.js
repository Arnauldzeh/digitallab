const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log technique côté console

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Une erreur interne est survenue.",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
