const User = require('../models/user');
const Product = require('../models/product');

const profile_get = async (req, res) => {

    let user = req.user;

    let items = [];

    let itemsArr = user.cart;
    for (let i = 0; i < itemsArr.length; i++) {
        items.push(await Product.findById(itemsArr[i]));
    }

    res.render('profile', {cardProducts: items})

}

const addToCart_get = async (req, res) => {
    let id = req.params.id;

    await User.findOneAndUpdate(
        {_id: req.user._id},
        {$push: {cart: id}});

    res.redirect('/');
}

const removeFromCart_get = async (req, res) => {
    let id = req.params.id;

    await User.findOneAndUpdate(
        {_id: req.user._id},
        {$pull: {cart: id}});

    res.redirect('/profile');
}

module.exports = {
    profile_get,
    addToCart_get,
    removeFromCart_get
}