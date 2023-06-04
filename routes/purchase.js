const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');
const authenticatemiddleware = require('../middleware/auth');

router.get('/premiummembership',authenticatemiddleware.authenticate,purchaseController.purchasePremium);

router.post('/updatetransactionstatus',authenticatemiddleware.authenticate,purchaseController.updateTransactionStatus);

module.exports = router;

