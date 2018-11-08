const Joi = require('joi');
const Schemas = require('../routes/validationSchemas');

const supportedMethods = ['post', 'put'];

module.exports = (req, res, next) => {
  const { method, route: { path } } = req;
  const schema = Schemas[path];

  const validationOptions = {
    abortEarly: false, // abort after all validation errors captured
    stripUnknown: true, // remove unknown keys from the validated data
  };

  if (supportedMethods.includes(method.toLowerCase()) && schema) {
    return Joi.validate(req.body, schema, validationOptions, (err, data) => {
      if (err) {
        const errors = {};
        err.details.forEach(({ context, message }) => { errors[context.key] = message; });

        return res.status(422).send({ errors });
      }

      req.body = data;
      return next();
    });
  }

  return res.status(422).send({ error: 'Unsupported request' });
};
