/**
 * Created by keithyang on 3/20/16.
 */

var User = require('../datasets/user');

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

// Create endpoint /api/users/:user_id for PUT
exports.putUser = function (req, res) {
    // Use the Event model to find a specific event
    User.findById(req.body._id, function (err, userData) {
        if (err)
            res.send(err);
        var user = userData;
        // Update the existing user username
        user.username = req.body.username;

        // Update the existing user password
        user.password = req.body.password;

        user.email = req.body.email;
        user.reported = req.body.reported;
        user.reported_text = req.body.reported_text;

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

