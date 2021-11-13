const { ValidationError } = require("express-validation");

const debug = require("debug")("network:errors");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line no-unused-vars
const generalErrorHandler = (error, req, res, next) => {
  debug("An error has occurred: ", error.message);
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error);
  }
  const message = error.code ? error.message : "General error";
  res.status(error.code || 500).json({ error: message });
};

module.exports = {
  notFoundErrorHandler,
  generalErrorHandler,
};
