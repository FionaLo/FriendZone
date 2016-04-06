/**
 * Created by keithyang on 4/5/16.
 */

var express = require('express');
var auth = express.Router();
var passport = require('passport');
require('../controllers/authentication-controller')(passport);
var jwt = require('jsonwebtoken');
var secret = require('../config/auth').secret;

var Token = require('../datasets/token');

// Facebook routes
// route for facebook authentication and login
auth.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after authentication by facebook
auth.get('/facebook/callback',
    passport.authenticate('facebook', function(req,res) {
        var token = jwt.sign({username: req.user.username}, secret, {subject: 'user'});

        Token.findOne({value: token}, function (err, token) {
            if (!token) {
                var newToken = new Token({
                    value: token
                });
                console.log(newToken);
                newToken.save();
            }

            res.json({
                user: req.user,
                token: token
            });
        });
    })
);