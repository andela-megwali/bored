const { TodoItem } = require('../models');
const { Todo } = require('../models');

const verifyAndProcessRequest = (req, res, processRequest, successAction) => Todo
  .findById(req.params.todoId)
  .then(
    (todo) => {
      if (!todo || (todo.userId !== req.currentUser.id && !req.currentUser.admin)) {
        return res.status(403).send({ message: 'Forbidden' });
      }

      return processRequest(todo, req, res, successAction);
    },
    err => res.status(400).send(err),
  );

const processRequest = (todo, req, res, successAction) => TodoItem
  .findOne({
    where: {
      todoId: todo.id,
      id: req.params.todoItemId,
    },
  })
  .then(
    (todoItem) => {
      if (!todoItem) {
        return res.status(404).send({ message: 'Not found' });
      }

      return successAction(todoItem);
    },
    err => res.status(400).send(err),
  );

module.exports = {
  create(req, res) {
    const createTodoItem = todo => TodoItem
      .create({
        content: req.body.content,
        todoId: todo.id,
      })
      .then(todoItem => res.status(201).send(todoItem), err => res.status(400).send(err));

    verifyAndProcessRequest(req, res, createTodoItem);
  },
  retrieve(req, res) {
    const sendTodoItem = todoItem => res.status(200).send(todoItem);
    verifyAndProcessRequest(req, res, processRequest, sendTodoItem);
  },
  update(req, res) {
    const updateTodoItem = todoItem => todoItem
      .update(req.body, { fields: Object.keys(req.body) })
      .then(() => res.status(200).send(todoItem), err => res.status(400).send(err));

    verifyAndProcessRequest(req, res, processRequest, updateTodoItem);
  },
  destroy(req, res) {
    const destroyTodoItem = todoItem => todoItem
      .destroy()
      .then(() => res.status(204).send(), err => res.status(400).send(err));

    verifyAndProcessRequest(req, res, processRequest, destroyTodoItem);
  },
};
