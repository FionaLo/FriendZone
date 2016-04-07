var jwt = require('jsonwebtoken');
var User = require('../datasets/user');
var Token = require('../datasets/token');
var authConfig = require('../config/auth');

var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// Followed tutorial on Scotch.io for adding passport strategies
// 
module.exports = function(passport) {

    // required for persistent login sessions

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // login
    passport.use('local-login', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ username :  username }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false);

                // Verify if the password is correct
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return done(err);
                    }
                    // Password did not match
                    if (!isMatch) {
                        return done(null, false);
                    }
                    // return user
                    return done(null, user);
                });
            });

    }));

    // signup
    passport.use('local-register', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ username: username }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false);
                    } else {

                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = password;
                        newUser.group = 'user';

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
    }));

    // basic strategy to protect api endpoints
    passport.use('basic', new BasicStrategy(
        function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) return done(err);
                // No user found with that username
                if (!user) return done(null, false);
                // Verify if the password is correct
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return done(err);
                    }
                    // Password did not match
                    if (!isMatch) {
                        return done(null, false);
                    }
                    // Success
                    return done(null, user);
                });
            });
        }
    ));

    // basic strategy for admin
    passport.use('basic-admin', new BasicStrategy(
        function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) return done(err);
                // No user found with that username
                if (!user) return done(null, false);
                // Verify if the password is correct
                if (!(user.group == 'admin')) return done(null, false);
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return done(err);
                    }
                    // Password did not ma  tch
                    if (!isMatch) {
                        return done(null, false);
                    }
                    // Success
                    return done(null, user);
                });
            });
        }
    ));

    // Jwt strategy
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = authConfig.secret;

    passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({ username: jwt_payload.username }, function(err, user) {
            if (err) return done(err, false);

            if (!user) return done(null, false);

            return done(null, user);
        })
    }));

    // Bearer Strategy
    passport.use('bearer', new BearerStrategy(
        function(accessToken, callback) {
            try {
                //we attempt to decode the token the user sends with his requests
                Token.findOne({ value: accessToken }, function(err, token) {

                    if (err) return callback(err);

                    if (!token) return callback(null, false);

                    var decoded = jwt.verify(token, authConfig.secret, function(err, decoded) {
                        console.log(decoded);
                    });
                    //we find the user that has made the request
                    User.findOne({ username: decoded.username }, function (err, user) {
                        if (err) { return callback(err); }
                        if (!user) {
                            return callback(null, false); //no such user
                        }
                        else {
                            return callback(null, user, { scope: '*' }); //allows the call chain to continue to the intented route
                        }
                    });
                });

            }
            catch(err){
                return callback(null, false); //returns a 401 to the caller
            }
        }
    ));

    // Facebook Strategy
    passport.use(new FacebookStrategy({

            // app id and secret configuration
            clientID        : authConfig.facebookAuth.clientID,
            clientSecret    : authConfig.facebookAuth.clientSecret,
            callbackURL     : authConfig.facebookAuth.callbackURL
        },

        // retrieve token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error return error
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser  = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id;
                        // we will save the token that facebook provides to the user
                        newUser.facebook.token = token;
                        //
                        newUser.facebook.name  = profile.name.givenName + ' '
                            + profile.name.familyName;
                        // take the first email returned by facebook
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.name = newUser.facebook.name;
                        newUser.username = profile.name.givenName.toLowerCase()
                            + profile.name.familyName.toLowerCase();
                        newUser.email = newUser.facebook.email;

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));
};

// Middleware to be used for secure routes
exports.ensureAuthed = function ensureAuthenticated(req, res, next){
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};
