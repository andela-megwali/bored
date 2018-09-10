const todosController = require('../controllers').todos;
const SchemaValidator = require('../middlewares/SchemaValidator');

module.exports = (app) => {
  app.post('/api/todos', SchemaValidator, todosController.create);
  app.get('/api/todos', todosController.list);
  app.get('/api/todos/:todoId', todosController.retrieve);
  app.put('/api/todos/:todoId', SchemaValidator, todosController.update);
  app.delete('/api/todos/:todoId', todosController.destroy);
};
