const User = require('../models/user');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');


const profile_get = async (req, res) => {
    const token = req.cookies.jwt;
    let user;

    jwt.verify(token, 'jwt secret', async (err, decodedToken) => {
        if (err) {
            user = null;
            res.redirect('/')
        } else {
            user = await User.findById(decodedToken.id);
        }

        let items = [];

        let itemsArr = user.cartItems;
        for (let i = 0; i < itemsArr.length; i++) {
            items.push(await Product.findById(itemsArr[i]));
        }

        res.render('profile', {cardProducts: items})
    });

}

const addToCart_get = async (req, res) => {
    let id = req.params.id;
    const token = req.cookies.jwt;
    let user;

    jwt.verify(token, 'jwt secret', async (err, decodedToken) => {
        if (err) {
            user = null;
            res.redirect('/login')
        } else {
            user = await User.findById(decodedToken.id);
        }
        await user.updateOne({$push: { cartItems: id }});
        res.redirect('/');
    });

}

const removeFromCart_get = async (req, res) => {
    let id = req.params.id;
    const token = req.cookies.jwt;
    let user;

    jwt.verify(token, 'jwt secret', async (err, decodedToken) => {
        if (err) {
            user = null;
            res.redirect('/login')
        } else {
            user = await User.findById(decodedToken.id);
        }
        await user.updateOne({$pull: { cartItems: id }});
        res.redirect('/profile');
    });

}

module.exports = {
    profile_get,
    addToCart_get,
    removeFromCart_get
}