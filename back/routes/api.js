/**
 * Created by keithyang on 3/26/16.
 */

var express = require('express');
var api = express.Router();

var eventController = require('../controllers/event-controller');
var userController = require('../controllers/user-controller');

api.get('/', function(req, res) {
    res.json({ message: 'welcome to friendzone api!' });
});

module.exports = api;
