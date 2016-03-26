var User = require('../datasets/user');

module.exports.signup = function (req, res) {
    var user = new User(req.body);
    user.save();
    res.json(req.body);
};

module.exports.login = function (req, res) {
    User.find(req.body, function (err, results) {
        if (err) {
            console.log(err);
        }

        if (results && results.length === 1) {
            var userData = results[0];
            res.json({
                email: userData.email,
                id: userData.id
            });
        }
    });
};