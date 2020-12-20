const routes = require('express').Router();
const { userInfo } = require('../controllers/users');

//returns information about the logged-in user (email and name)
routes.get('/me', userInfo);

module.exports = routes;