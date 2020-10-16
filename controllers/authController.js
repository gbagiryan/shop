const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = {firstName: '', lastName: '', email: '', password: ''};

    if (err.message === 'incorrect email') {
        errors.email = "email doesn't exist";
    }
    if (err.message === 'incorrect password') {
        errors.password = "wrong password";
    }
    if (err.code === 11000) {
        errors.email = 'email already exists';
        return errors;
    }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {

            errors[properties.path] = properties.message;
        });
    }

    return errors;
}
const maxAge = 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
}

const login_post = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true, maxAge: maxAge * 1000
        });
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const signup_post = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    try {
        const user = await User.create({firstName, lastName, email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true, maxAge: maxAge * 1000
        });
        res.status(201).json({user: user._id});

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
const logout_get =  (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

const login_get = (req, res) => {
    res.render('login');
}

const signup_get = (req, res) => {
    res.render('signup');
}

module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post,
    logout_get
}