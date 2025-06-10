const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const employeeController = require('../controllers/employee');
const visaStatusController = require('../controllers/visa')

router.get('/profile', auth, employeeController.getProfile);

router.post('/profile', auth, employeeController.submitProfile);

router.get('/visa-status', auth, visaStatusController.getVisaStatus);
router.post('/visa-status/:step', auth, visaStatusController.uploadVisaDocument);

module.exports = router;
