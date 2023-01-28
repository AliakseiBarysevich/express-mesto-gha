/* eslint-disable no-unused-vars */
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUser, getCurrentUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const { validateUrl } = require('../utils/validateUrl');

const usersRoutes = express.Router();

usersRoutes.get('/', getAllUsers);
usersRoutes.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);
usersRoutes.get('/me', getCurrentUser);
usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), express.json(), updateUserInfo);
usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), express.json(), updateUserAvatar);

module.exports = usersRoutes;
