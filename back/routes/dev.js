var express = require('express');
var dev = express.Router();

var authenticationController = require('../controllers/authentication-controller.js');
var eventController = require('../controllers/event-controller');
var userController = require('../controllers/user-controller');

var User = require('../datasets/user');
var Event = require('../datasets/event');

dev.get('/', function(req, res) {
    res.json({ message: 'welcome to friendzone api!' });
});

dev.get('/clear-users', function(req, res){
    User.remove({}, function(){
        res.json({message: "Users cleared"});
    });
});

dev.get('/clear-events', function(req, res){
    Event.remove({}, function(){
        res.json({message: "Events cleared"});
    });
});

dev.get('/init-users', function(req, res){
    var test = new User({username: "test", password: "test", group: "user",
        email: "test@test.com", description: "", profile_image: ""});
    test.save();
    var test1 = new User({username: "test1", password: "test1", group: "user",
        email: "test1@test1.com", description: "", profile_image: ""});
    test1.save();
    var test2 = new User({username: "test2", password: "test2", group: "user",
        email: "test2@test2.com", description: "", profile_image: ""});
    test2.save();
    var admin = new User({username: "admin", password: "admin", group: "admin",
        email: "admin@admin.com", description: "", profile_image: ""});
    admin.save();
    res.json({message: "Users initialized"});
});

module.exports = dev;
