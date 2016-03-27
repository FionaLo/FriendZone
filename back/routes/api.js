var express = require('express');
var api = express.Router();

var authenticationController = require('../controllers/authentication-controller.js');
var eventController = require('../controllers/event-controller');
var userController = require('../controllers/user-controller');

var passport = require('passport');
require('../controllers/authentication-controller')(passport);

api.get('/', function(req, res) {
    res.json({ message: 'welcome to friendzone api!' });
});

api.route('/events')
    .post(passport.authenticate('basic', { session: false }), eventController.postEvents)
    .get(passport.authenticate('basic', { session: false }), eventController.getEvents);

api.route('/events/:event_id')
    .get(passport.authenticate('basic', { session: false }), eventController.getEvent)
    .put(passport.authenticate('basic', { session: false }), eventController.putEvent)
    .delete(passport.authenticate('basic', { session: false }), eventController.deleteEvent);

api.route('/users')
    .post(passport.authenticate('basic', { session: false }), userController.createUsers)
    .get(passport.authenticate('basic', { session: false }), userController.getUsers);

api.route('/users/:user_id')
    .put(passport.authenticate('basic', { session: false }), userController.putUser)
    .delete(passport.authenticate('basic-admin', { session: false }), userController.deleteUser);

api.post("/api/user/signup", authenticationController.signup);
api.post("/api/user/login", authenticationController.login);

module.exports = api;
