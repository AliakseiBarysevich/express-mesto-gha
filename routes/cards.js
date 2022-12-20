/* eslint-disable no-unused-vars */
const express = require('express');
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', getAllCards);
cardsRoutes.post('/', express.json(), createCard);
cardsRoutes.delete('/:cardId', deleteCard);
cardsRoutes.put('/:cardId/likes', likeCard);
cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRoutes;
