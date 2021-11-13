const chalk = require("chalk");
const cors = require("cors");
const debug = require("debug")("network:server");
const express = require("express");
const morgan = require("morgan");
const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middlewares/error");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Server is listening on port number: ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("There was an error starting the server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`The port ${port} is in use.`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.yellow("Server express disconnected"));
    });
  });

app.use("/users", usersRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };
