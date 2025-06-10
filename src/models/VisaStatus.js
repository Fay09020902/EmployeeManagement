const mongoose = require('mongoose');

const VisaStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  type: { type: String, enum: ['F1(CPT/OPT)', 'Other'], required: true },

  optReceipt: {
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    url: String,
    feedback: String
  },

  optEAD: {
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    url: String,
    feedback: String
  },

  i983: {
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    url: String,
    feedback: String
  },

  i20: {
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    url: String,
    feedback: String
  }

}, { timestamps: true });

module.exports = mongoose.model('VisaStatus', VisaStatusSchema);
