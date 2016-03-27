/**
 * Created by keithyang on 3/26/16.
 */

var express = require('express');
var api = express.Router();

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

module.exports = api;
