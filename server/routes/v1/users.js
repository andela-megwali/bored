const usersController = require('../../controllers').users;
const SchemaValidator = require('../../middlewares/SchemaValidator');

module.exports = (app) => {
  app.get('/api/v1/users', usersController.list);
  app.get('/api/v1/users/:userId', usersController.retrieve);
  app.put('/api/v1/users/:userId', SchemaValidator, usersController.update);
  app.delete('/api/v1/users/:userId', usersController.destroy);
  app.get('/api/v1/logout', usersController.logout);
  app.get('/api/v1/logout/:userId', usersController.logout);
};
