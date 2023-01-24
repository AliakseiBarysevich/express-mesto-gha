/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictingRequestError = require('../errors/conflicting-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ServerError = require('../errors/server-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const getUser = (req, res) => {
  User.findById(req.params.id).select('-__v')
    .orFail(new Error('User not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Указан некорректный _id.');
      }
      if (err.message === 'User not found') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const getCurrentUser = (req, res) => {
  User.findById(req.user._id).select('-__v')
    .orFail(new Error('User not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Указан некорректный _id.');
      }
      if (err.message === 'User not found') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'user validation failed') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
      }
      if (err.code === 11000) {
        throw new ConflictingRequestError('Переданы некорректные данные при создании пользователя.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }).select('-__v')
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'Validation failed') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
      if (err.message === 'User not found') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true }).select('-__v')
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'Validation failed') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      }
      if (err.message === 'User not found') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError('Произошла ошибка аутентификации');
    })
    .catch(next);
};

module.exports = {
  getAllUsers, getUser, getCurrentUser, createUser, updateUserInfo, updateUserAvatar, login,
};
