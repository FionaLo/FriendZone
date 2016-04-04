var express = require('express');
var dev = express.Router();

var User = require('../datasets/user');
var Event = require('../datasets/event');

dev.get('/', function(req, res) {
    res.json({ message: 'welcome to dev tools!' });
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
        email: "test@test.com", description: "", profile_image: "", reported: true,
        reported_text: "Just sucks"});
    test.save();
    for (var i = 0; i < 10; i++){
        var testI = new User({username: "test" + i, password: "test" + i, group: "user",
            email: "test" + i + "@test" + i + ".com", description: "", profile_image: ""});
        testI.save();
    }
    var admin = new User({username: 'admin', password: 'admin', group: 'admin'});
    admin.save();
    res.json({message: "Users initialized"});
});

module.exports = dev;
