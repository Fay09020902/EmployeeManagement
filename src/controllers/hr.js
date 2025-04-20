const AccessRequest = require('../models/AccessRequest');
const sendInviteEmail = require('../utils/sendInviteEmail');
const User = require('../models/User');

// ✅ HR can view all access requests (pending, approved, rejected)
exports.getAccessRequests = async (req, res) => {
    try {
      const requests = await AccessRequest.find().sort({ createdAt: -1 });
      res.status(200).json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch access requests' });
    }
  };

exports.approveAccessRequest = async (req, res) => {
    const { id } = req.params;

    try {
      const request = await AccessRequest.findById(id);
      if (!request) return res.status(404).json({ message: 'Request not found' });

      if (request.status === 'approved') {
        return res.status(400).json({ message: 'Already approved' });
      }

      // Check if user already registered
      const existingUser = await User.findOne({ email: request.email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already registered with this email' });
      }

      // Send the invite email with registration link
      await sendInviteEmail(request.email);

      // Mark the request as approved
      request.status = 'approved';
      await request.save();

      res.status(200).json({ message: 'Access request approved and registration email sent.' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to approve and send email' });
    }
  };


  exports.rejectAccessRequest = async (req, res) => {
    const { id } = req.params;

    try {
      const request = await AccessRequest.findById(id);
      if (!request) return res.status(404).json({ message: 'Request not found' });

      if (request.status !== 'pending') {
        return res.status(400).json({ message: `Cannot reject a request that is already ${request.status}` });
      }

      request.status = 'rejected';
      await request.save();

      res.status(200).json({ message: 'Access request rejected' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to reject request' });
    }
  };
