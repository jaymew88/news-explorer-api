const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(https?:\/\/(www)?)+.+/g.test(v),
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(https?:\/\/(www)?)+.+/g.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articlesSchema);
