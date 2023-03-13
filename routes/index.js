const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { validateUrl } = require('../utils/validateUrl');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const routes = express.Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }),
}), createUser);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routes.use('/users', auth, usersRoutes);
routes.use('/cards', auth, cardsRoutes);
routes.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = routes;
