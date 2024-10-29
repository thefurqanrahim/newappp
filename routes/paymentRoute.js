const express = require('express');
const { createPaymentIntent, getPaymentDetails, updatePaymentStatus } = require('../controllers/ecommerceController');
const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.get('/:userId', getPaymentDetails);
router.patch('/update-status', updatePaymentStatus);


module.exports = router;
