var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var userModel = require('../models/UserModel');
module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log("---------------------checking in  mongo if a user exists or not-------------------------");
            console.log(username);
            console.log(password);
			console.log(req.session);
			
			console.log(!req.session.usr);
			
            // if(!req.session.usr){
				// console.log('----if---');
				// if(){
					
				// }else{
					
				// }
				
				
            // check in mongo if a user with username exists or not
            userModel.findOne({
                    'username': username
                },
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log error & redirect back
                    if (!user) {
                        console.log('----------User Not Found with username------- ' + username);
                        return done(null, false,
                            req.flash('message', 'User Not found.'));
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)) {
                        console.log('----------------Invalid Password---------------------');
                        return done(null, false,
                            req.flash('message', 'Invalid Password'));
                    }
                    console.log("----------User and password both match in pass.js----------------");
                    // User and password both match, return user from 
                    // done method which will be treated like success
					req.session.usr=user;
					console.log(req.session);
					console.log(req.session.usr);
                    return done(null, user);
                }
            );
			// }else{
				// console.log("===========else=========");
				// if(req.session.usr.username == username){
					// console.log('-=-=-=if-=-=-=-==-');
				// req.flash('message', 'user already logged in ');
				// }
			// }
        }));

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            findOrCreateUser = function() {
                // find a user in Mongo with provided username
                userModel.findOne({
                    'username': username
                }, function(err, user) {
                    // In case of any error return
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists');
                        return done(null, false,
                            req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new userModel();
                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration successful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute 
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    passport.serializeUser(function(user, done) {
        console.log("===========serialize User in pass.js ============");
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("=============deserialize User in pass.js================");
        userModel.findById(id, function(err, user) {
            done(err, user);
        });
    });
}



var isValidPassword = function(user, password) {

    console.log("----------isValidPassword in app.js--------------");
    return bcrypt.compareSync(password, user.password);
}


// Generates hash using bCrypt
var createHash = function(password) {
    console.log("----------createHash----------");
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}