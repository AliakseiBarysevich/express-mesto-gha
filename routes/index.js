const express = require('express');

const routes = express.Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);

module.exports = routes;
