const express = require('express');
const { createPaymentIntent } = require('../controllers/ecommerceController');
const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
