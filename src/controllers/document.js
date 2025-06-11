const express = require('express');
const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { type, userId } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    if (!type) {
      return res.status(400).json({ success: false, message: 'Document type is required.' });
    }
    const newDoc = new Document({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      type,
      status: 'pending',
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: newDoc });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload', error: err.message });
  }
};


exports.listDocuments = async (req, res) => {
  try {
    const myDocuments = await Document.find({ userId: req.user.userId });
    res.json(myDocuments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list documents' });
  }
};
