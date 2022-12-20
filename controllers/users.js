/* eslint-disable no-unused-vars */
const User = require('../models/user');

const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR = 500;

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
};
const getUser = (req, res) => {
  User.findById(req.params.id).select('-__v')
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Указан некорректный _id.' });
      }
      if (err.message === 'User not found') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'user validation failed') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.', ...err });
    });
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
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.message === 'User not found') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
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
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.message === 'User not found') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.', ...err });
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUserInfo, updateUserAvatar,
};
