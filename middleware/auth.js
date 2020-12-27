const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizationErr = require('../config/errors/unauth-err');
const errorMessages = require('../config/errors/errorMessages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizationErr(errorMessages.authRequired);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizationErr(errorMessages.authRequired);
  }
  req.user = payload;
  next();
};