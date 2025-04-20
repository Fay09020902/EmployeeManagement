const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isHR = require('../middleware/isHR');

const {
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest
} = require('../controllers/hr');

router.get('/access-requests', auth, isHR, getAccessRequests);
router.put('/access-requests/:id/approve', auth, isHR, approveAccessRequest);
router.put('/access-requests/:id/reject', auth, isHR, rejectAccessRequest);

module.exports = router;
