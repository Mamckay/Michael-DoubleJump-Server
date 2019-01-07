'use strict';

/* 
mongoimport --db doublejump --collection reviews --drop --file ./primer-review-dataset.json
mongoimport --db doublejump --collection products --drop --file ./primer-product-dataset.json
*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');
const passport = require('passport');
const reviewRouter = require('./routes/reviews');
const productRouter = require('./routes/products');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
mongoose.Promise = global.Promise;
const app = express();


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
app.use(express.json());

// Find what this actually does
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);
// begin adding routers
app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
const jwtAuth = passport.authenticate('jwt', { session: false });
app.use('/reviews', reviewRouter);
app.use('/products', productRouter);

if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(DATABASE_URL)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = { app };