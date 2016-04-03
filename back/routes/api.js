var express = require('express');
var api = express.Router();

var passport = require('passport');
require('../controllers/authentication-controller')(passport);
var jwt = require('jwt-simple');
var authConfig = require('../config/auth');

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
    .post(userController.createUsers)
    .get(passport.authenticate('basic', {session: false}), userController.getUsers);

api.route('/users/:user_id')
    .put(passport.authenticate('basic', { session: false }), userController.putUser)
    .delete(passport.authenticate('basic-admin', { session: false }), userController.deleteUser);

api.post('/login',
    passport.authenticate('local-login', {session: false }), function(req,res){
        var token = jwt.encode({ username: req.user.username }, authConfig.secret);
        res.json({
            user: req.user,
            token: token
        });
    });

api.post('/signup',
    passport.authenticate('local-register'), function(req,res){
        res.json(req.user)
    });

module.exports = api;
