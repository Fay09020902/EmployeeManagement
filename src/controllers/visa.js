const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Document = require('../models/Document');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();


exports.hrVisaStatusByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await EmployeeProfile.findOne({ userId })
      .populate('documents');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const docTypes = ['opt_receipt', 'opt_ead', 'i_983', 'i_20'];
    const docResult = {};
    for (let type of docTypes) {
      const doc = (profile.documents || []).find(d => d.type === type);
      docResult[type] = doc
        ? {
            path: doc.fileUrl,
            status: doc.status,
            feedback: doc.feedback,
            originalName: doc.originalName,
            _id: doc._id,
          }
        : null;
    }
    res.json({
      userId: profile.userId,
      optReceipt: docResult['opt_receipt'],
      optEAD: docResult['opt_ead'],
      i983: docResult['i_983'],
      i20: docResult['i_20'],
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch visa detail', error: err.message });
  }
};


exports.hrVisaStatusAll = async (req, res) => {
  try {
    // 找出所有 F1(OPT) 员工
    const profiles = await EmployeeProfile.find({ "visa.visaType": "F1(CPT/OPT)" })
      .populate('userId', 'email onboardingStatus fullName firstName lastName')
      .populate('documents');
    const result = [];

    for (const profile of profiles) {
      const user = profile.userId;
      const docs = profile.documents || [];
      const getStatus = (type) => {
        const d = docs.find(d => d.type === type);
        return d ? d.status : 'Not Submitted';
      };
      result.push({
        userId: user._id,
        fullName: `${profile.firstName} ${profile.lastName}`,
        email: user.email,
        workAuth: profile.visa?.visaType || '',
        optReceiptStatus: getStatus('opt_receipt'),
        optEADStatus: getStatus('opt_ead'),
        i983Status: getStatus('i_983'),
        i20Status: getStatus('i_20')
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all visa status', error: err.message });
  }
};


exports.hrVisaStatusReview = async (req, res) => {
  try {
    const { userId, docType, action, feedback } = req.body;
    // if (!['approve', 'reject'].includes(action)) {
    //   return res.status(400).json({ message: 'Invalid action' });
    // }
    const doc = await Document.findOne({ userId, type: docType }).sort({ createdAt: -1 });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.status = action === 'approve' ? 'Approved' : 'Rejected';
    doc.feedback = feedback || '';
    await doc.save();
    res.json({ message: 'Document reviewed', status: doc.status });
  } catch (err) {
    res.status(500).json({ message: 'Review failed', error: err.message });
  }
};

exports.sendReminder = async (req, res) => {
    const { userId, docType, action } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'fyj121322@gmail.com',
        subject: 'Action Required: Please upload your ${nextDoc.label}',
        html: 'Please login to exmployee to see visa status'
    });
}
