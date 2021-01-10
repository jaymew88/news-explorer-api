const jwt = require('jsonwebtoken');
const UnauthorizationErr = require('../config/errors/unauth-err');
const { ERROR_MESSGAES } = require('../config/utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizationErr(ERROR_MESSGAES.authRequired);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizationErr(ERROR_MESSGAES.authRequired);
  }
  req.user = payload;
  next();
};
