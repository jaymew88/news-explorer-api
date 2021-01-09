const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizationErr = require('../config/errors/unauth-err');
const ConflictErr = require('../config/errors/conflict-err');
const NotFoundErr = require('../config/errors/notfound-err');
const { errorMessages } = require('../config/errors/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

const userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundErr(errorMessages.invalidUser);
      }
    }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, { httpOnly: true });
      res.send({ data: user, token });
    })
    .catch(() => {
      throw new UnauthorizationErr(errorMessages.invalidUser);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.findOne({ email })
    .then((userExists) => {
      if (userExists) {
        throw new ConflictErr(errorMessages.conflictUser);
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then((user) => {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
              { expiresIn: '7d' },
            );
            res.send({
              data: {
                name: user.name,
                email: user.email,
                _id: user.id,
              },
              token,
            });
          });
      }
    })
    .catch(next);
};

// const createUser = (req, res, next) => {
//   const { name, email, password } = req.body;

//   bcrypt.hash(password, 10).then((hash) => {
//     User.create({ name, email, password: hash })
//       .then((user) => {
//         const token = jwt.sign(
//           { _id: user._id },
//           NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
//           { expiresIn: '7d' },
//         );
//         res.cookie('token', token, { httpOnly: true });
//         res.status(201).send({ data: user, token });
//       });
//   })
//     .catch(next);
// };

module.exports = { userInfo, login, createUser };
