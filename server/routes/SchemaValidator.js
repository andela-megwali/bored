const Joi = require('joi');
const Schemas = require('./validationSchemas');

const supportedMethods = ['post', 'put'];

module.exports = (req, res, next) => {
  const method = req.method.toLowerCase();
  const route = req.route.path;
  const schema = Schemas[route];

  if (supportedMethods.includes(method) && schema) {
    return Joi.validate(req.body, schema, (err, data) => {
      if (err) {
        const error = err.details.find(({ message }) => message);
        return res.status(422).send({ error: error.message });
      }

      req.body = data;
      next();
    });
  }
};
