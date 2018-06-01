/**
 * User Model
 *
 * @author Shubham Jolly
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    gender: String,
    address: String
}, {
    collection: 'users'
}, {
    versionKey: false
});

// methods ======================
// generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('UserModel', userSchema);