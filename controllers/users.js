/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictingRequestError = require('../errors/conflicting-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const MONGO_EMAIL_DUPLICATE_ERROR_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан некорректный _id.'));
      } else {
        next(err);
      }
    });
};
const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан некорректный _id.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      }))
      .catch((err) => {
        // eslint-disable-next-line no-underscore-dangle
        if (err._message === 'user validation failed') {
          next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        }
        if (err.code === MONGO_EMAIL_DUPLICATE_ERROR_CODE) {
          next(new ConflictingRequestError('Переданы некорректные данные при создании пользователя.'));
        } else {
          next(err);
        }
      }));
};
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'Validation failed') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'Validation failed') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      } else {
        next(err);
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError('Произошла ошибка аутентификации'));
    })
    .catch(next);
};

module.exports = {
  getAllUsers, getUserById, getCurrentUser, createUser, updateUserInfo, updateUserAvatar, login,
};
