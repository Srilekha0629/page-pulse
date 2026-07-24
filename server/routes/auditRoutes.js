const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.post('/analyze', auditController.analyzeWebsite);

module.exports = router;