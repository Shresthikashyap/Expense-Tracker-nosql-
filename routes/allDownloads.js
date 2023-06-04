const express = require('express');

const allDownloadController = require('../controllers/downloadFile')
const userauthentication = require('../middleware/auth');

const router=express.Router();

router.get('/all', userauthentication.authenticate, allDownloadController.getAllFiles)

module.exports = router;