const todoItemsController = require('../controllers').todoItems;
const SchemaValidator = require('../middlewares/SchemaValidator');

module.exports = (app) => {
  app.post('/api/todos/:todoId/todoItems', SchemaValidator, todoItemsController.create);
  app.get('/api/todos/:todoId/todoItems/:todoItemId', todoItemsController.retrieve);
  app.put('/api/todos/:todoId/todoItems/:todoItemId', SchemaValidator, todoItemsController.update);
  app.delete('/api/todos/:todoId/todoItems/:todoItemId', todoItemsController.destroy);
};
