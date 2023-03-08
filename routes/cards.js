/* eslint-disable no-unused-vars */
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateUrl } = require('../utils/validateUrl');

const validationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
};

const cardsRoutes = express.Router();

cardsRoutes.get('/', getAllCards);
cardsRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateUrl),
  }),
}), createCard);
cardsRoutes.delete('/:cardId', celebrate(validationConfig), deleteCard);
cardsRoutes.put('/:cardId/likes', celebrate(validationConfig), likeCard);
cardsRoutes.delete('/:cardId/likes', celebrate(validationConfig), dislikeCard);

module.exports = cardsRoutes;
