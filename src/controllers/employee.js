const EmployeeProfile = require('../models/EmployeeProfile');
const User = require('../models/User')
const multer = require('multer');
const storage = multer.memoryStorage(); // optional: use diskStorage if saving locally
const upload = multer({ storage });

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
    const userId = req.user.id;
    const data = req.body;

    const profile = await EmployeeProfile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

     await User.findByIdAndUpdate(userId, {
      onboardingStatus: 'Pending',
    });

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    console.error('Submit profile error:', err);
    res.status(500).json({ message: 'Server error while submitting profile.' });
  }
}
// exports.submitProfile = async (req, res) => {
//   try {
//     const formValues = JSON.parse(req.body.formValues);
//     const visaDocMeta = req.body.visaDocumentsMeta ? JSON.parse(req.body.visaDocumentsMeta) : [];

//     // Attach profile picture
//     if (req.files['profilePicture']) {
//       const profilePicPath = req.files['profilePicture'][0].path;
//       formValues.profilePictue = `http://localhost:5000/${profilePicPath}`;
//     } else if (req.body.profilePictureUrl) {
//       formValues.profilePictue = req.body.profilePictureUrl;
//     }

//     // Attach visa documents
//     if (visaDocMeta.length > 0) {
//       formValues.visa = formValues.visa || {};
//       formValues.visa.documents = visaDocMeta.map(meta => {
//         const file = req.files[meta.fileField]?.[0];
//         return {
//           name: meta.name,
//           url: file ? `http://localhost:5000/${file.path}` : '',
//         };
//       });
//     }

//     // Upsert the employee profile
//     const existing = await EmployeeProfile.findOne({ userId: req.user._id });

//     if (existing) {
//       await EmployeeProfile.updateOne({ userId: req.user._id }, formValues);
//       res.json({ message: 'Profile updated' });
//     } else {
//       const newProfile = new EmployeeProfile({ ...formValues, userId: req.user._id });
//       await newProfile.save();
//       res.json({ message: 'Profile created' });
//     }

//   } catch (err) {
//     res.status(500).json({ message: err.errmsg });
//   }
// };
// exports.submitProfile = async (req, res) => {
//     try {
//         const formValues = JSON.parse(req.body.formValues);

//         const existing = await EmployeeProfile.find({userId: req.user._id});

//         if(existing) {
//             await EmployeeProfile.updateOne({ userId: req.user._id }, formValues);
//             res.json({ message: 'Profile updated' });
//         } else {
//             const newProfile = new EmployeeProfile({ ...formValues, userId: req.user._id });
//             await newProfile.save();
//             res.json({ message: 'Profile submitted' });
//         }
//     } catch(err) {
//         res.status(500).json({ message: err.errmsg });
//     }
//  }
