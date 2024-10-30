const express = require('express');
const { getAllProducts, createProduct, HandleGetBestSellers } = require('../controllers/ecommerceController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/products', createProduct);

router.get('/best-sellers', HandleGetBestSellers);

module.exports = router;
