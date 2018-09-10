const Joi = require('joi');

const authSchema = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const todoItemCreateSchema = Joi.object().keys({
  complete: Joi.boolean(),
  content: Joi.string().alphanum().required(),
});

const todoItemUpdateSchema = Joi.object().keys({
  complete: Joi.boolean(),
  content: Joi.string().alphanum(),
});

const todoSchema = Joi.object().keys({
  title: Joi.string().alphanum().max(100).required(),
});

const userSignupSchema = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  name: Joi.string().alphanum().max(30).required(),
  password: Joi.string().min(8).required(),
});

const userUpdateSchema = Joi.object().keys({
  admin: Joi.boolean(),
  email: Joi.string().email().lowercase(),
  name: Joi.string().alphanum().max(30),
  password: Joi.string().min(8),
});


module.exports = {
  '/api/login': authSchema,
  '/api/signup': userSignupSchema,
  '/api/todos': todoSchema,
  '/api/todos/:todoId': todoSchema,
  '/api/todos/:todoId/todoitems': todoItemCreateSchema,
  '/api/todos/:todoId/todoitems/:todoItemId': todoItemUpdateSchema,
  '/api/users/:userId': userUpdateSchema,
};
