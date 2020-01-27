const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  _id: { type: String, maxLength: 255 },
  email: { type: String, maxLength: 255 },
  fullName: { type: String, maxLength: 255 },
  avatarURL: { type: String, maxLength: 512 },
  isBlocked: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date,
},{
  versionKey: false,
  _id: false,
});

module.exports = mongoose.model('users', User);
