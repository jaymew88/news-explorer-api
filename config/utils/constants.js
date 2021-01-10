const { NODE_ENV, SERVER_DB_ADDRESS } = process.env;

module.exports.ERROR_MESSGAES = {
  authRequired: 'Authorization Required',
  couldNotCreateArticle: 'Article validation failed',
  notUsersArticle: 'Article does not belong to user',
  invalidArticle: 'Invalid article',
  invalidUser: 'User ID not found',
  incorrectLogin: 'Incorrect password or email',
  notFound: 'Requested Resource not found',
  conflictUser: 'User already exists',
};

module.exports.DB_ADDRESS = NODE_ENV === 'production' ? SERVER_DB_ADDRESS : 'mongodb://168.61.39.42/news';
