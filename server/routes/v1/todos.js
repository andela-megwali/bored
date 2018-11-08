const todosController = require('../../controllers').todos;
const SchemaValidator = require('../../middlewares/SchemaValidator');

module.exports = (app) => {
  app.post('/api/v1/todos', SchemaValidator, todosController.create);
  app.get('/api/v1/todos', todosController.list);
  app.get('/api/v1/todos/:todoId', todosController.retrieve);
  app.put('/api/v1/todos/:todoId', SchemaValidator, todosController.update);
  app.delete('/api/v1/todos/:todoId', todosController.destroy);
};
