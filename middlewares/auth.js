const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
}

module.exports = { auth };
