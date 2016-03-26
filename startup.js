var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://admin:admin@ds023118.mlab.com:23118/friendzone');

var app = express();
app.use(bodyParser.json());
app.use("/public", express.static(__dirname+"/public"));
app.use("/front", express.static(__dirname+"/front"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.get("/", function(req, res){
   res.sendfile('index.html');
});

var authenticationController = require('./back/controllers/authentication-controller.js');
app.post("/api/user/signup", authenticationController.signup);
app.post("/api/user/login", authenticationController.login);



app.listen(3000, function(){
    console.log('Listening on 3000');
});