'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  items: { type: Array, required: true },
  price: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  completed: { type: Boolean, required: true },
  shipdate: { type: Date, required: true }
});

schema.set('timestamps', true);

// schema.index({name:1}, {unique:true});

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Order', schema);