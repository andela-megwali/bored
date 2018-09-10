const usersController = require('../controllers').users;
const SchemaValidator = require('../middlewares/SchemaValidator');

module.exports = (app) => {
  app.get('/api/users', usersController.list);
  app.get('/api/users/:userId', usersController.retrieve);
  app.put('/api/users/:userId', SchemaValidator, usersController.update);
  app.delete('/api/users/:userId', usersController.destroy);
  app.get('/api/logout', usersController.logout);
  app.get('/api/logout/:userId', usersController.logout);
};
