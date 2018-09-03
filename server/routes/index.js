const todos = require('./todos');
const todoItems = require('./todoItems');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Pointless being here though 🙄'
  }));

  todos(app);
  todoItems(app);
}
