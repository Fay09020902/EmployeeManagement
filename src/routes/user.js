const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth')
const isHR = require('../middleware/isHR')

const {
  getAllEmployees,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  searchUsersByName,
  sendResetEmail
} = require('../controllers/user');

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

// ✅ Update personal info
router.put('/:id', auth, updateUserInfo);

//✅ Update password
router.post('/reset-password', sendResetEmail);

// ✅ Search user by name (HR only)
router.get('/search/name', auth, isHR, searchUsersByName);

module.exports = router;
