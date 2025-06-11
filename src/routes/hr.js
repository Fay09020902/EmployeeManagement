const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isHR = require('../middleware/isHR');

const {
  getInvitesHistory,
  sendRegistrationLink,
  rejectAccessRequest,
  getAllEmployeeProfiles,
  getEmployeeProfileById,
} = require('../controllers/hr');

const {
  getApplicationsByStatus,
  getApplicationByUserId,
  approveOnboarding,
  rejectOnboarding,
} = require('../controllers/onboarding')

// GET /api/hr/invites - HR only
router.get('/invites', auth, isHR, getInvitesHistory);

//POST /api/hr/send-invite - HR only
router.post('/send-invite', auth, isHR, sendRegistrationLink)

//Get applications by onboardingStatus (pending, approved, rejected)
router.get('/hiring/applications/:status', getApplicationsByStatus );

router.get('/hiring/application/:userId', getApplicationByUserId );

router.put('/hiring/application/approve', approveOnboarding);

router.put('/hiring/application/reject', rejectOnboarding);





router.get('/employees', auth, isHR, getAllEmployeeProfiles)
router.get('/employees/:id', auth, isHR, getEmployeeProfileById)



// router.put('/access-requests/:id/approve', auth, isHR, approveAccessRequest);
// router.put('/access-requests/:id/reject', auth, isHR, rejectAccessRequest);

module.exports = router;
