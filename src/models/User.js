const mongoose = require('mongoose');
const gravatar = require('gravatar');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true }, // token validates email
  avatar: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '200', r: 'pg', d: 'mm' });
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
