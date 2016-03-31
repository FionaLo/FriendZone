var express = require('express');
var api = express.Router();

var passport = require('passport');
var authenticationController = require('../controllers/authentication-controller')(passport);

var eventController = require('../controllers/event-controller');
var userController = require('../controllers/user-controller');

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
    .get(passport.authenticate('basic', { session: false }), userController.getUsers)
    .put(passport.authenticate('basic', { session: false }), userController.putUser)
    .delete(passport.authenticate('basic-admin', { session: false }), userController.deleteUser);

api.post('/user/login', passport.authenticate('local-login'));
api.post('/user/signup', passport.authenticate('local-signup'));

module.exports = api;
