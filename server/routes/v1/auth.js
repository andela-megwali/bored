const authController = require('../../controllers').auth;
const SchemaValidator = require('../../middlewares/SchemaValidator');

module.exports = (app) => {
  app.post('/api/v1/signup', SchemaValidator, authController.signup);
  app.post('/api/v1/login', SchemaValidator, authController.login);
};
