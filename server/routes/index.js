const auth = require('./auth');
const todos = require('./todos');
const todoItems = require('./todoItems');
const users = require('./users');
const { authenticateRequest } = require('../middlewares/tokenAuthentication');

module.exports = (app) => {
  // Unprotected routes
  app.get('/api', (req, res) => res.status(200).send({ message: 'Pointless being here though 🙄' }));
  auth(app);

  // Authentication middleware
  app.use(authenticateRequest);

  // Protected routes
  todos(app);
  todoItems(app);
  users(app);
};
