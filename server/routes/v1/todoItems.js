const todoItemsController = require('../../controllers').todoItems;
const SchemaValidator = require('../../middlewares/SchemaValidator');
const { processRequest, verifyRequest } = require('../../middlewares/TodoItemRequestHandler');

module.exports = (app) => {
  app.use('/api/v1/todos/:todoId/todoItems', verifyRequest);
  app.post('/api/v1/todos/:todoId/todoItems', SchemaValidator, todoItemsController.create);
  app.use('/api/v1/todos/:todoId/todoItems/:todoItemId', processRequest);
  app.get('/api/v1/todos/:todoId/todoItems/:todoItemId', todoItemsController.retrieve);
  app.put('/api/v1/todos/:todoId/todoItems/:todoItemId', SchemaValidator, todoItemsController.update);
  app.delete('/api/v1/todos/:todoId/todoItems/:todoItemId', todoItemsController.destroy);
};
