const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'please enter a valid name']
    },
    lastName: {
        type: String,
        required: [true, 'please enter a valid last name']
    },
    email: {
        type: String,
        required: [true, 'please enter a valid username'],
        unique: true,
        validate: [isEmail, 'username must be a valid eMail']
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: [6, 'minimal length must be 6 characters'],
    },
    cartItems: [String]
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error("incorrect email");
}

const User = mongoose.model('User', userSchema);

module.exports = User;