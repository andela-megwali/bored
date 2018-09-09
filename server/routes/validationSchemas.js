const Joi = require('joi');

const authSchema = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const todoItemSchema = Joi.object().keys({
  complete: Joi.boolean(),
  content: Joi.string().alphanum().required(),
});

const todoSchema = Joi.object().keys({
  title: Joi.string().alphanum().max(100).required(),
});

const userSchema = Joi.object().keys({
  admin: Joi.boolean(),
  email: Joi.string().email().lowercase().required(),
  issueId: Joi.string().hex().length(32),
  name: Joi.string().alphanum().max(30).required(),
  password: Joi.string().min(8).required(),
});


module.exports = {
  '/api/login': authSchema,
  '/api/signup': userSchema,
  '/api/todos': todoSchema,
  '/api/todos/:todoId': todoSchema,
  '/api/todos/:todoId/todoitems': todoItemSchema,
  '/api/todos/:todoId/todoitems/:todoItemId': todoItemSchema,
  '/api/users': userSchema,
};
