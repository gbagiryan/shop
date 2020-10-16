const express = require('express');
const cartController = require('../controllers/cartController');
const {requireAuth, checkUser, authedUser} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', requireAuth, cartController.profile_get);
router.get('/add-to-cart/:id', requireAuth, cartController.addToCart_get);
router.get('/remove-from-cart/:id', requireAuth, cartController.removeFromCart_get);

module.exports = router;