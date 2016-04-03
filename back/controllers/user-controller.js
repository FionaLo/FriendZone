/**
 * Created by keithyang on 3/20/16.
 */

var User = require('../datasets/user');
var jwt = require('jwt-simple');
var authConfig = require('../config/auth');

// Create endpoint /api/user for POST
exports.createUsers = function (req, res) {

    // Create a new user with properties that came from the POST data
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        group: req.body.group
    });

    user.save(function (err) {
        if (err) res.send(err);

        res.json({message: 'new user created'});
    });
};

// Create endpoint /api/users for GET
exports.getUsers = function (req, res) {
    User.find(req['query'], function (err, users) {
        if (err){
            res.error(err);
        } else {
            res.json(users);
        }
    });
};

// exports.getUsers2 = function(req, res) {
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (token) {
//         jwt.decode(token, authConfig.secret, function(err, decoded) {
//             if (err) {
//                 return res.json({ success: false, message: 'Failed to authenticate token.' });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 User.find(req['query'], function(err, users) {
//                     if (err) {
//                         res.error(err);
//                     } else {
//                         res.json(users);
//                     }
//                 });
//             }
//         });
//     }
// };

// Create endpoint /api/users/:user_id for PUT
exports.putUser = function (req, res) {
    // Use the Event model to find a specific event
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);

        // Update the existing user username
        user.username = req.body.name;

        // Update the existing user password
        user.password = req.body.password;

        // Save the event and check for errors
        user.save(function (err) {
            if (err)
                res.send(err);

            res.json(user);
        });
    });
};

// Create endpoint /api/users/:user_id for DELETE
exports.deleteUser = function (req, res) {
    // Use the User model to find a specific event and remove it
    User.findByIdAndRemove(req['query']['user_id'], function (err) {
        if (err)
            res.send(err);

        res.json({message: 'user deleted'});
    });
};
