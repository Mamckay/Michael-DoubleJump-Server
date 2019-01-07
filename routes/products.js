'use strict';

const express = require('express');
const mongoose = require('mongoose');
//const passport = require('passport');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log(req.body);
    Product.find({})
      .sort('name')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  });
  
  router.get('/:id', (req, res, next) => {
    console.log(req.body);
    const id = req.params.id;

    Product.find({_id: id})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* Delete Review */

router.delete('/:id', (req,res,next) => {
    const id = req.params.id;

    Product.findOneAndRemove({_id: id})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
})

/* Post Review */
router.post('/', (req, res, next) => {
  console.log(req.body);
  const { name, genre, description } = req.body;
  console.log(name);
  const newReview = { name, genre, description, imgUrl };

  // Checking for improper input from the user
  // Check for bad ids
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Product.create(newReview)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, description, genre, imgUrl, comment } = req.body;
  // const userId = req.user.id;
  // Checking for improper input from the user
  // Check for bad ids
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateReview = { name, description , genre , imgUrl, price};

  Product.findOneAndUpdate({_id: id} , updateReview, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;
