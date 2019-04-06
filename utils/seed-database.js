const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const Product = require('../models/product');
const Review = require('../models/review');

const { products, reviews } = require('../db/data');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.info('Delete Data');
    return Promise.all([
      Product.deleteMany(),
      Review.deleteMany()
    ]);
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Product.insertMany(products),
      Review.insertMany(reviews)
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
