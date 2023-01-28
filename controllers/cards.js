/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getAllCards = (req, res, next) => {
  Card.find({}).select('-__v')
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err._message === 'card validation failed') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .populate('owner')
    .then((card) => {
      if (card.owner.id !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку.');
      }
      return card.remove()
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        });
    })
    .catch(next);
};
const likeCard = (req, res, next) => {
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
    })
    .catch(next);
};
const dislikeCard = (req, res, next) => {
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
    })
    .catch(next);
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
