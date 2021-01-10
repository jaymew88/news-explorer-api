const Article = require('../models/article');
const BadRequestErr = require('../config/errors/badrequest-err');
const NotFoundErr = require('../config/errors/notfound-err');
const ForbiddenErr = require('../config/errors/forbbiden-err');
const { ERROR_MESSGAES } = require('../config/utils/constants');

// Returns all articles saved by the user
const savedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.status(201).send({ data: article })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestErr(ERROR_MESSGAES.couldNotCreateArticle);
          }
          next(err);
        });
    })
    .catch(next);
};

// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (article && req.user._id.toString() === article.owner.toString()) {
        Article.deleteOne(article)
          .then((articleDeleted) => {
            res.send({ data: articleDeleted });
          });
      } else if (!article) {
        throw new NotFoundErr(ERROR_MESSGAES.invalidArticle);
      } else {
        throw new ForbiddenErr(ERROR_MESSGAES.notUsersArticle);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr(ERROR_MESSGAES.invalidArticle);
      }
      next(err);
    }).catch(next);
};

module.exports = { savedArticles, createArticle, deleteArticle };
