const express = require('express');
const { getAllProducts, createProduct } = require('../controllers/ecommerceController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/products', createProduct);

module.exports = router;
