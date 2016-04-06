var express = require('express');
var api = express.Router();

var Token = require('../datasets/token');

var passport = require('passport');
require('../controllers/authentication-controller')(passport);
// var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');
var secret = require('../config/auth').secret;

var eventController = require('../controllers/event-controller');
var userController = require('../controllers/user-controller');


api.get('/', function(req, res) {
    res.json({ message: 'welcome to friendzone api!' });
});

api.route('/events')
    .post(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.postEvents)
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.getEvents)
    .put(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.putEvent)
    .delete(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.deleteEvent);
api.route('/events/many')
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.getEventsMany);

api.route('/users')
    .post(userController.createUsers)
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), userController.getUsers)
    .put(passport.authenticate(['jwt', 'basic'], { session: false }), userController.putUser)
    .delete(passport.authenticate(['jwt', 'basic-admin'], { session: false }), userController.deleteUser);
api.route('/users/single')
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), userController.getUserSingle);
api.route('/users/many')
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), userController.getUsersMany);
api.route('/users/current')
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), userController.getCurrentUser);

api.post('/login',
    passport.authenticate('local-login'), function(req,res){
        var token = jwt.sign({ username: req.user.username }, secret, { subject: 'user' });

        Token.findOne({ value: token }, function(err, token) {
            if (!token) {
                var newToken = new Token({
                    value: token
                });
                console.log(newToken);
                newToken.save();
            }
        });

        // res.set('Authorization', token);
        
        res.json({
            user: req.user,
            token: token
        });
    });

api.post('/signup',
    passport.authenticate('local-register'), function(req,res){
        var token = jwt.sign({ username: req.user.username }, secret, { subject: 'user' });

        Token.findOne({ value: token }, function(err, token) {
            if (!token) {
                var newToken = new Token({
                    value: token
                });
                console.log(newToken);
                newToken.save();
            }
        });

        // res.set('Authorization', token);

        res.json({
            user: req.user,
            token: token
        });
    });

module.exports = api;
