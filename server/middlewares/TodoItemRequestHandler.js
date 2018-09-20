const { Todo, TodoItem } = require('../models');

const verifyRequest = (req, res, next) => Todo
  .findById(req.params.todoId)
  .then(
    (todo) => {
      if (!todo || (todo.userId !== req.currentUser.id && !req.currentUser.admin)) {
        return res.status(403).send({ message: 'Forbidden' });
      }

      req.todo = todo;
      next();
    },
    () => res.status(400).send('Bad request'),
  );


const processRequest = (req, res, next) => TodoItem
  .findOne({
    where: {
      todoId: req.todo.id,
      id: req.params.todoItemId,
    },
  })
  .then(
    (todoItem) => {
      if (!todoItem) {
        return res.status(404).send({ message: 'Not found' });
      }

      req.todoItem = todoItem;
      next();
    },
    err => res.status(500).send(err),
  );

module.exports = {
  verifyRequest,
  processRequest,
};
