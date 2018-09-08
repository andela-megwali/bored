const auth = require('./auth');
const todos = require('./todos');
const todoItems = require('./todoItems');
const users = require('./users');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({ message: 'Pointless being here though 🙄' }));
  auth(app);
  todos(app);
  todoItems(app);
  users(app);
};
