var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var http = require('http');
var debug = require('debug')('friendzone:server');

// connect to MongoDb database
mongoose.connect('mongodb://admin:admin@ds023118.mlab.com:23118/friendzone', function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

// api routes
var api = require('./back/routes/api');
var dev = require('./back/routes/dev');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.use("/front", express.static(__dirname + "/front"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.get("/", function(req, res){
   res.sendFile(__dirname + '/index.html');
});

app.use('/api', api);

var authenticationController = require('./back/controllers/authentication-controller.js');
// app.post("/api/user/signup", authenticationController.signup);
// app.post("/api/user/login", authenticationController.login);
app.use('/dev', dev);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.json({message: "404 Not Found"});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.status(err.status).json('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.status(err.status).json('error', {
        message: err.message,
        error: {}
    });
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
