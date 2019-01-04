'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String },
  imgUrl: {type: String}
});

// Add `createdAt` and `updatedAt` fields
schema.set('timestamps', true);
schema.index({name:1,genre:1,description:1, imgUrl: 1 }, {unique:true});
// Transform output during `res.json(data)`, `console.log(data)` etc.
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Review', schema);
