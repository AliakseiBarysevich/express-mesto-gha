/* eslint-disable no-unused-vars */
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), getAllCards);
cardsRoutes.post('/', express.json(), createCard);
cardsRoutes.delete('/:cardId', deleteCard);
cardsRoutes.put('/:cardId/likes', likeCard);
cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = { cardsRoutes };
