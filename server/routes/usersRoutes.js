const express = require("express");
const { validate } = require("express-validation");
const { loginRequestSchema } = require("../requestSchemas/loginRequestSchema");
const {
  registerRequestSchema,
} = require("../requestSchemas/registerRequestSchema");
const createUser = require("../middlewares/createUser");
const loginUser = require("../controller/loginUser");

const router = express.Router();

router.post("/login", validate(loginRequestSchema), loginUser);

router.post("/register", validate(registerRequestSchema), createUser);

module.exports = router;
