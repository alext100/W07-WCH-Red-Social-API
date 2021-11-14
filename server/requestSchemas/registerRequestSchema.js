const { Joi } = require("express-validation");

const registerRequestSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    age: Joi.number(),
    image: Joi.string(),
  }),
};

module.exports = { registerRequestSchema };
