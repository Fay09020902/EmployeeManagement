const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const employeeController = require('../controllers/employee');


router.get('/profile', auth, employeeController.getProfile);

router.post('/profile', auth, employeeController.submitProfile);

module.exports = router;
