const todoItemsController = require('../controllers').todoItems;

module.exports = (app) => {
  app.post('/api/todos/:todoId/todoItems', todoItemsController.create);
  app.get('/api/todos/:todoId/todoItems', todoItemsController.list);
  app.get('/api/todos/:todoId/todoItems/:todoItemId', todoItemsController.retrieve);
  app.put('/api/todos/:todoId/todoItems/:todoItemId', todoItemsController.update);
  app.delete('/api/todos/:todoId/todoItems/:todoItemId', todoItemsController.destroy);
}
