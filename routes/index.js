const express = require('express');
const { auth } = require('../middlewares/auth');

const routes = express.Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

routes.use('/users', auth, usersRoutes);
routes.use('/cards', auth, cardsRoutes);

module.exports = { routes };
