const express = require('express');
const router = express.Router();

const premiumcontroller = require('../controllers/premium')
const userauthentication = require('../middleware/auth')

router.get('/leadership',userauthentication.authenticate,premiumcontroller.leaderBoard);

module.exports = router;