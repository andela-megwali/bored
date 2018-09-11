const auth = require('./auth');
const todos = require('./todos');
const todoItems = require('./todoItems');
const users = require('./users');
const authenticateRequest = require('../middlewares/tokenAuthentication');

module.exports = (app) => {
  // Enable cors
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

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
