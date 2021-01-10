const routes = require('express').Router();
const { userInfo } = require('../controllers/users');

// Returns information about the logged-in user (email and name)
routes.get('/me', userInfo);

module.exports = routes;
