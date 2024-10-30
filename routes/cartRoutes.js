const express = require('express');
const { addToCart, getCart } = require('../controllers/ecommerceController');
const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);
router.delete('/:userId/:productId', HandleDeleteCartItem);
router.put('/:userId', HandleUpdateCart);


module.exports = router;
