/* eslint-disable no-unused-vars */
const Card = require('../models/card');

const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR = 500;

const getAllCards = (req, res) => {
  Card.find({}).select('-__v')
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.', ...err }));
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'card validation failed') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.', ...err });
    });
};
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      return res.status(200).send({ message: 'Пост удалён' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Указан некорректный _id карточки.' });
      }
      if (err.message === 'Card not found') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true }).select('-__v')
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err.message === 'Card not found') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true }).select('-__v')
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err.message === 'Card not found') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
