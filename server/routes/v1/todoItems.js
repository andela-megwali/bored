const todoItemsController = require('../../controllers').todoItems;
const SchemaValidator = require('../../middlewares/SchemaValidator');

module.exports = (app) => {
  app.post('/api/v1/todos/:todoId/todoItems', SchemaValidator, todoItemsController.create);
  app.get('/api/v1/todos/:todoId/todoItems/:todoItemId', todoItemsController.retrieve);
  app.put('/api/v1/todos/:todoId/todoItems/:todoItemId', SchemaValidator, todoItemsController.update);
  app.delete('/api/v1/todos/:todoId/todoItems/:todoItemId', todoItemsController.destroy);
};
