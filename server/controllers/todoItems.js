const { TodoItem } = require('../models');

module.exports = {
  create(req, res) {
    TodoItem
      .create({
        content: req.body.content,
        todoId: req.todo.id,
      })
      .then(todoItem => res.status(201).send(todoItem), err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return res.status(200).send(req.todoItem);
  },
  update(req, res) {
    return req.todoItem
      .update(req.body, { fields: Object.keys(req.body) })
      .then(() => res.status(200).send(req.todoItem), err => res.status(400).send(err));
  },
  destroy(req, res) {
    return req.todoItem
      .destroy()
      .then(() => res.status(204).send(), err => res.status(400).send(err));
  },
};
