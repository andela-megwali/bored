const authController = require('../controllers').auth;

module.exports = (app) => {
  app.post('/api/signup', authController.signup);
  app.post('/api/login', authController.login);
  app.use('/api', authController.authenticate);
  app.post('/api/logout', authController.login);
};
