const express = require("express")

const router = express.Router();


router.post('/create-product/:storeID', (req, res) => HandleCreateProduct(req, res, req.io));
router.patch('/update-product/:storeID', (req, res) => HandleUpdateProduct(req, res, req.io));


export default router;