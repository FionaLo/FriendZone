var express = require('express');
var api = express.Router();

var authenticationController = require('../controllers/authentication-controller.js');
var eventController = require('../controllers/event-controller');
var userController = require('../controllers/user-controller');

api.get('/', function(req, res) {
    res.json({ message: 'welcome to friendzone api!' });
});

api.post("/api/user/signup", authenticationController.signup);
api.post("/api/user/login", authenticationController.login);

module.exports = api;
