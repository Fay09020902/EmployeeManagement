const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isHR = require('../middleware/isHR');

const {
  getInvitesHistory,
  sendRegistrationLink,
  rejectAccessRequest,
} = require('../controllers/hr');


// GET /api/hr/invites - HR only
router.get('/invites', auth, isHR, getInvitesHistory);

//POST /api/hr/send-invite - HR only
router.post('/send-invite', auth, isHR, sendRegistrationLink)
// router.put('/access-requests/:id/approve', auth, isHR, approveAccessRequest);
// router.put('/access-requests/:id/reject', auth, isHR, rejectAccessRequest);

module.exports = router;
