const User = require('../models/user');
const Product = require('../models/product');

const profile_get = async (req, res) => {

    let user = req.user;

    let itemsArr = [];

    let cartArr = user.cart;
    for (let i = 0; i < cartArr.length; i++) {
        itemsArr.push(await Product.findById(cartArr[i].itemID));
        itemsArr[i].amount = cartArr[i].amount;
    }

    res.render('profile', {cardProducts: itemsArr})

}

const addToCart_get = async (req, res) => {
    let id = req.params.id;

    const user = await User.findOne({_id: req.user._id});

    let duplicateItem = false;
    user.cart.forEach((item) => {
        if (item.itemID === id) {
            duplicateItem = true;
        }
    });

    if (duplicateItem) {
        await User.findOneAndUpdate(
            {_id: user.id, "cart.itemID": id},
            {$inc: {"cart.$.amount": 1}});
    } else
        await user.updateOne({$push: {cart: {itemID: id, amount: 1}}});

    res.redirect('/');
}

const removeFromCart_get = async (req, res) => {
    let id = req.params.id;
    const user = await User.findOne({_id: req.user._id});

    let itemToDelete = null;

    user.cart.forEach((item) => {
        if (item.itemID === id) {
            itemToDelete = item;
        }
    });
    if (itemToDelete.amount > 1) {
        await User.findOneAndUpdate(
            {_id: user.id, "cart.itemID": id},
            {$inc: {"cart.$.amount": -1}});
    } else {
        await user.updateOne({$pull: {cart: {itemID: id}}});
    }


    // const user = await User.findOne({_id: req.user._id});
    //
    // let itemCounter = 0;
    // user.cart.forEach((item)=>{
    //     if (item!==id){
    //         updatedCart.push(item);
    //     }
    // })
    // await user.updateOne({cart: updatedCart});

    // await User.findOneAndUpdate(
    //     {_id: req.user._id},
    //     {$pull: {cart: id}});

    res.redirect('/profile');
}

module.exports = {
    profile_get,
    addToCart_get,
    removeFromCart_get
}