const mongoose = require('mongoose');

const { Schema } = mongoose;

const Item = new Schema({
  _id: { type: String, maxLength: 255 },
  label: { type: String, maxLength: 255 },
  createdBy: { type: String, maxLength: 255 },
  updatedBy: { type: String, maxLength: 255 },
  createdAt: Date,
  updatedAt: Date,
},{
  versionKey: false,
  _id: false,
});

module.exports = mongoose.model('items', Item);
