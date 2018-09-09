const authController = require('../controllers').auth;
const SchemaValidator = require('./SchemaValidator');

module.exports = (app) => {
  app.post('/api/signup', SchemaValidator, authController.signup);
  app.post('/api/login', SchemaValidator, authController.login);
  app.use('/api', authController.authenticate);
  app.get('/api/logout', authController.login);
};
