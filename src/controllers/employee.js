const EmployeeProfile = require('../models/EmployeeProfile');

exports.getProfile = async (req, res) => {
    try {
        const profile = await EmployeeProfile.findOne({ userId: req.user._id });
        res.json(profile)
    } catch(err) {
         res.status(500).json({ message: err.errmsg });
    }
}


exports.submitProfile = async (req, res) => {
    try {
        const data = req.body;
        const existing = await EmployeeProfile.find({userId: req.user._id});
        if(existing) {
            await EmployeeProfile.updateOne({ userId: req.user._id }, data);
            res.json({ message: 'Profile updated' });
        } else {
            const newProfile = new EmployeeProfile({ ...data, userId: req.user._id });
            await newProfile.save();
            res.json({ message: 'Profile submitted' });
        }
    } catch(err) {
        res.status(500).json({ message: err.errmsg });
    }
 }
