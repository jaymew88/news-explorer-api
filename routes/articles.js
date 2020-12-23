
const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');

const {
  savedArticles,
  createArticle,
  deleteArticle
} = require('../controllers/articles');

// GET /articles
routes.get('/', savedArticles);

// POST /articles
routes.post('/', bodyParser.json(), celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }),
}), createArticle);

// DELETE /articles/articleId
routes.delete('/:articleId', deleteArticle);

module.exports = routes;