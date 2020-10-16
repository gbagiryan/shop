const User = require('../models/user');
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, 'jwt secret', async (err, decodedToken)=>{
            if (err){
                res.redirect('/login');
            }else{
                req.user = await User.findById(decodedToken.id);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}
const checkUser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, 'jwt secret', async (err, decodedToken)=>{
            if (err){
                res.locals.user = null;
                next();
            }else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}
const authedUser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, 'jwt secret', (err, decodedToken)=>{
            if (err){
                next();
            }else{
                res.redirect('/profile');
            }
        })
    }else{
        next();
    }
}

module.exports = {requireAuth, checkUser, authedUser};