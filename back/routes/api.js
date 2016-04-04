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
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.getEvents);

api.route('/events/:event_id')
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.getEvent)
    .put(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.putEvent)
    .delete(passport.authenticate(['jwt', 'basic'], { session: false }), eventController.deleteEvent);

api.route('/users')
    .post(userController.createUsers)
    .get(passport.authenticate(['jwt', 'basic'], { session: false }), userController.getUsers);

api.route('/users/:user_id')
    .put(passport.authenticate(['jwt', 'basic'], { session: false }), userController.putUser)
    .delete(passport.authenticate(['jwt', 'basic-admin'], { session: false }), userController.deleteUser);

api.post('/login',
    passport.authenticate('local-login'), function(req,res){
        var token = jwt.sign({ username: req.user.username }, secret, { subject: 'user' });

        Token.findOne({ value: token }, function(err, token) {
            if (!token) {
                newToken = new Token({
                    value: token
                });
                console.log(newToken);
                newToken.save();
            }
        });

        // res.set('Authorization', token);
        
        res.json({
            // user: req.user,
            token: token
        });
    });

// api.post('/login',
//     passport.authenticate('bearer', { session: false }), function(req, res) {
//         res.json(req.user);
//     }
// );

api.post('/signup',
    passport.authenticate('local-register'), function(req,res){
        res.json(req.user)
    });

module.exports = api;
