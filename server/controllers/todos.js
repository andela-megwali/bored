const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

module.exports = {
  create(req, res) {
    return Todo.create({
      title: req.body.title,
    })
    .then(todo => res.status(201).send(todo), err => res.status(400).send(err));
  },
  list(req, res) {
    return Todo.findAll({
      include: [{
        model: TodoItem,
        as: 'todoItems',
      }],
    }).then(todos => res.status(200).send(todos), err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return Todo.findById(req.params.todoId, {
      include: [{
        model: TodoItem,
        as: 'todoItems',
      }],
    }).then(todo => (
      todo ? res.status(200).send(todo) : res.status(404).send({ message: 'Not found' })
    ), err => res.status(400).send(err));
  },
  update(req, res) {
    return Todo.findById(req.params.todoId, {
      include: [{
        model: TodoItem,
        as: 'todoItems',
      }],
    })
    .then(
      todo => {
        if (!todo) {
          return res.status(404).send({ message: `Todo ${req.params.todoId} not found` });
        }

        return todo.update(req.body, { fields: Object.keys(req.body) })
          .then(() => res.status(200).send(todo), err => res.status(400).send(err));
      },
      err => res.status(400).send(err)
    );
  },
  destroy(req, res) {
    return Todo.findById(req.params.todoId)
      .then(
        todo => {
          if (!todo) {
            return res.status(404).send({ message: `Todo ${req.params.todoId} not found` });
          }

          return todo.destroy().then(() => res.status(204).send(), err => res.status(400).send(err));
        },
        err => res.status(400).send(err)
      );
  },
};
