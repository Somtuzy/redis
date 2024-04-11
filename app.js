require("express-async-errors")
const express = require("express");
require("dotenv").config();
const UserController = require("./user.controller");
const cache = require("./redis.middleware");

async function initializeExpressServer() {
  // initialize an Express application
  const app = express();
  app.use(express.json());

  // register an endpoint
  app.get("/api/v1/users", cache({}) , UserController.getAll);

  app.use((error, req, res, next) => {
    return res.json({
      error: error
    })
  })

  // start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

initializeExpressServer()
  .then()
  .catch((e) => console.log('There was an error starting the server:', e));