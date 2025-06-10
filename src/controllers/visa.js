const VisaStatus = require('../models/VisaStatus');
const {getVisaStep} = require('../utils/getVisaStep')


exports.getVisaStatus = async (req, res) => {
  try {
    const visa = await VisaStatus.findOne({ userId: req.user._id });
    if(!visa) return res.json(null)
    const currentStep = getVisaStep(visa);
    res.json({currentStep});
  } catch (err) {
    res.status(500).json({ message: err.errmsg });
  }
};

exports.uploadVisaDocument = async (req, res) => {
  try {
    const { step } = req.params; // e.g., 'optReceipt', 'optEAD', 'i983', 'i20'
    const { url, type = 'F1(CPT/OPT)' } = req.body;

    // Step must be one of the allowed fields
    const validSteps = ['optReceipt', 'optEAD', 'i983', 'i20'];
    if (!validSteps.includes(step)) {
      return res.status(400).json({ message: 'Invalid visa step' });
    }

    let visa = await VisaStatus.findOne({ userId: req.user._id });

    if (!visa) {
      // First-time upload: create a new VisaStatus document
      visa = new VisaStatus({
        userId: req.user._id,
        type,
        [step]: {
          status: 'Pending',
          url
        }
      });
    } else {
      // Update only the specific step
      visa[step].status = 'Pending';
      visa[step].url = url;
      visa[step].feedback = ''; // Clear previous feedback on resubmission
    }

    await visa.save();
    res.json({ message: `${step} uploaded successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload visa document' });
  }
};
