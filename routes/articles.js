const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  savedArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

// GET /articles
routes.get('/', savedArticles);

// POST /articles
routes.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().pattern(new RegExp('^https?:\\/\\/(www\\.)?[^\\s~<>]+\\.[^\\s~<>]+#?')),
    image: Joi.string().pattern(new RegExp('^https?:\\/\\/(www\\.)?[^\\s~<>]+\\.[^\\s~<>]+#?')),
  }),
}), createArticle);

// DELETE /articles/id
routes.delete('/:id', celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}),
deleteArticle);

module.exports = routes;
