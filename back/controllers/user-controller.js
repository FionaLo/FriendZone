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
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'new user created'});
        }
    });
};

// Create endpoint /api/users for GET
exports.getUsers = function (req, res) {
    var query = {};
    if (req.query.filter != undefined && req.query.sort != undefined){
        if (JSON.parse(req.query.filter).group !== undefined){
            query.group = JSON.parse(req.query.filter).group;
        }
        if (JSON.parse(req.query.filter).username !== '' && JSON.parse(req.query.filter).username !== undefined){
            query.username = JSON.parse(req.query.filter).username;
        }
        if (JSON.parse(req.query.filter).gender !== '' && JSON.parse(req.query.filter).gender !== undefined){
            query.gender = JSON.parse(req.query.filter).gender;
        }
        if (JSON.parse(req.query.filter).location !== '' && JSON.parse(req.query.filter).location !== undefined){
            query.location = JSON.parse(req.query.filter).location;
        }
        sortQuery = JSON.parse(req.query.sort);
        if (sortQuery === {}){
            User.find(query).exec(function (err, users) {
                if (err){
                    res.error(err);
                } else {
                    res.json(users);
                }
            });
        } else {
            console.log(sortQuery);
            console.log(query);
            User.find(query).sort(sortQuery).exec(function (err, users) {
                if (err){
                    res.error(err);
                } else {
                    res.json(users);
                }
            });
        }

    } else {
        User.find().exec(function (err, users) {
            if (err){
                res.error(err);
            } else {
                res.json(users);
            }
        });
    }

};
exports.getUsersMany = function (req, res){
    User.find({'_id': { $in: req['query'].ids}}, function (err, users) {
        if (err){
            res.send(err);
        } else {
            res.json(users);
        }
    });
};
exports.getUserSingle = function (req, res){
    User.findById(req['query'].id, function (err, userData) {
        if (err){
            res.send(err);
        } else {
            var user = userData;
            res.json(user);
        }
    });
};

// Create endpoint /api/users/:user_id for PUT
exports.putUser = function (req, res) {
    // Use the Event model to find a specific event
    User.findById(req.body._id, function (err, userData) {
        if (err){
            res.send(err);
        } else {
            var user = userData;
            // Update the existing user username
            user.username = req.body.username;

            // Update the existing user password
            user.password = req.body.password;

            user.email = req.body.email;
            user.location = req.body.location;
            user.gender = req.body.gender;
            user.description = req.body.description;

            user.reported = req.body.reported;
            user.reported_text = req.body.reported_text;
            user.rating_total = req.body.rating_total;
            user.rating_count = req.body.rating_count;
            user.events = req.body.events;
            user.attend_events = req.body.attend_events;

            // Save the event and check for errors
            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json(user);
            });
        }
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

exports.getCurrentUser = function (req, res) {
    User.findById(req.user._id, function (err, userData) {
        if (err){
            res.send(err);
        } else {
            var user = userData;
            res.json(user);
        }
    });
};
