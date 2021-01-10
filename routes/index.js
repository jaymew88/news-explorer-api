const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const users = require('./users');
const articles = require('./articles');
const { login, createUser } = require('../controllers/users');

// checks the email & password passed in the body & returns a JWT
routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')),
    password: Joi.string().required(),
  }),
}), login);

// creates a user with the passed email, password, & name in the body
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().pattern(new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')),
    password: Joi.string().trim().min(1).required(),
  }),
}), createUser);

routes.use('/users', auth, users);
routes.use('/articles', auth, articles);

module.exports = routes;
