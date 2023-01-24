/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');

const getAllCards = (req, res) => {
  Card.find({}).select('-__v')
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'card validation failed') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Card not found'))
    .then((card) => res.status(200).send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Указан некорректный _id карточки.');
      }
      if (err.message === 'Card not found') {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true }).select('-__v')
    .populate('owner')
    .orFail(new Error('Card not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      }
      if (err.message === 'Card not found') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true }).select('-__v')
    .populate('owner')
    .orFail(new Error('Card not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      }
      if (err.message === 'Card not found') {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      throw new ServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
