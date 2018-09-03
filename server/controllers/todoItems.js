const TodoItem = require('../models').TodoItem;

module.exports = {
  create(req, res) {
    return TodoItem.create({
      content: req.body.content,
      todoId: req.params.todoId,
    })
    .then(todoItem => res.status(201).send(todoItem), err => res.status(400).send(err));
  },
  list(req, res) {
    return TodoItem.findAll({
      where: {
        todoId: req.params.todoId,
      },
    })
      .then(todoItems => {
        if (!todoItems) {
          return res.status(404).send({ message: `No Todo items found on ${req.params.todoId}` });
        }

        return res.status(200).send(todoItems)
      }, err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return TodoItem.find({
      where: {
        todoId: req.params.todoId,
        id: req.params.todoItemId,
      }
    }).then(todoItem => {
      if (!todoItem) {
        return res.status(404).send({ message: `Todo item ${req.params.todoItemId} not found` });
      }

      return res.status(200).send(todoItem);
    }, err => res.status(400).send(err));
  },
  update(req, res) {
    return TodoItem.find({
      where: {
        todoId: req.params.todoId,
        id: req.params.todoItemId,
      }
    }).then(todoItem => {
      if (!todoItem) {
        return res.status(404).send({ message: `Todo item ${req.params.todoItemId} not found` });
      }

      return todoItem.update(req.body, { fields: Object.keys(req.body) })
        .then(() => res.status(200).send(todoItem), err => res.status(400).send(err));
    }, err => res.status(400).send(err));
  },
  destroy(req, res) {
    return TodoItem.find({
      where: {
        todoId: req.params.todoId,
        id: req.params.todoItemId,
      }
    }).then(todoItem => {
      if (!todoItem) {
        return res.status(404).send({ message: `Todo item ${req.params.todoItemId} not found` });
      }

      return todoItem.destroy().then(() => res.status(204).send(), err => res.status(400).send(err));
    });
  },
};
