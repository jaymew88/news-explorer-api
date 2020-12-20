const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UnauthorizationErr = require('../errors/unauth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user })
      } else {
        throw new NotFoundErr('user ID not found');
      }
    }).catch(next);
}

const login = (req, res, next) => {
  const { email, password } = req.body;

   return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
        );
        res.cookie('token', token, { httpOnly: true });
        res.send({ data: user, token });
    })
    .catch((err) => {
      throw new UnauthorizationErr(err.message);
    })
    .catch(next);
}

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  bcrypt.hash(password, 10).then(hash => {
    User.create({ name, email, password: hash })
      .then((user) => {
        console.log(hash);
        const token =jwt.sign(
          { _id: user._id},
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' }
       );
      res.cookie('token', token, { httpOnly: true });
      res.send({ data: user, token });
    })
  })
  .catch(next);
}

module.exports ={ userInfo, login, createUser };