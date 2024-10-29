const express = require('express');
const router = express.Router();
const addressController = require('../controllers/ecommerceController');


router.post('/', addressController.addAddress);
router.get('/:userId', addressController.getUserAddresses);
router.put('/:addressId', addressController.updateAddress);
router.delete('/:addressId', addressController.deleteAddress);
