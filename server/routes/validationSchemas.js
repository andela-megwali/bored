const Joi = require('joi');

const authSchema = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const todoItemCreateSchema = Joi.object().keys({
  complete: Joi.boolean(),
  content: Joi.string().required(),
});

const todoItemUpdateSchema = Joi.object().keys({
  complete: Joi.boolean(),
  content: Joi.string(),
});

const todoSchema = Joi.object().keys({
  title: Joi.string().max(100).required(),
});

const userSignupSchema = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  name: Joi.string().max(30).required(),
  password: Joi.string().min(8).required(),
});

const userUpdateSchema = Joi.object().keys({
  admin: Joi.boolean(),
  email: Joi.string().email().lowercase(),
  name: Joi.string().max(30),
  password: Joi.string().min(8),
});

module.exports = {
  '/api/v1/login': authSchema,
  '/api/v1/signup': userSignupSchema,
  '/api/v1/todos': todoSchema,
  '/api/v1/todos/:todoId': todoSchema,
  '/api/v1/todos/:todoId/todoItems': todoItemCreateSchema,
  '/api/v1/todos/:todoId/todoItems/:todoItemId': todoItemUpdateSchema,
  '/api/v1/users/:userId': userUpdateSchema,
};
