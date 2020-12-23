const Article = require('../models/article');


//returns all articles saved by the user
const savedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({data: articles}))
    .catch(next);
}

// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image  } = req.body;
  const owner = req.user._id;
  console.log(req.body);

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      if (!article) {
        throw new BadRequestErr('Card validation failed');
      }
      res.status(201).send({ data: article});
    })
    .catch(next);
}

// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove({ _id: req.params.articleId, owner: req.user._id })
    .then((article) => {
      if (article) {
        res.send({ data: article });
      } else {
        throw new NotFoundErr('Card does not belong to user');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Invalid card id');
      }
    }).catch(next);
}

module.exports ={ savedArticles, createArticle, deleteArticle };