/* eslint-disable no-unused-vars */
const express = require('express');
const {
  getAllUsers, getUser, getCurrentUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/', getAllUsers);
usersRoutes.get('/:id', getUser);
usersRoutes.get('/me', getCurrentUser);
usersRoutes.patch('/me', express.json(), updateUserInfo);
usersRoutes.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = { usersRoutes };
