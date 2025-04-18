const express = require('express');
const User = require('../models/User');
const router = express.Router();

const {
  getAllEmployees,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  searchUsersByName
} = require('../controllers/userController');

// const auth = require('../middlewares/auth');     // JWT auth middleware
// const isHR = require('../middlewares/isHR');     // role check middleware (HR only)
// const canEditSelf = require('../middlewares/canEditSelf'); // optional: user can only edit their own info

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// ✅ Get all employees (HR only)
router.get('/', auth, isHR, getAllEmployees);

// ✅ Get current logged-in user's info
router.get('/me', auth, getCurrentUser);

// ✅ Get one user by ID (HR only)
router.get('/:id', auth, isHR, getUserById);

// ✅ Update personal info (only self)
router.put('/:id', auth, canEditSelf, updateUserInfo);

// // ✅ Update password
// router.put('/:id/password', updatePassword); // You can add auth if not via reset token


// ✅ Search user by name (HR only)
router.get('/search/name', auth, isHR, searchUsersByName);

module.exports = router;
