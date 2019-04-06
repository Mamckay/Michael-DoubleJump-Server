'use strict';

const express = require('express');
const mongoose = require('mongoose');
//const passport = require('passport');
const Review = require('../models/review');
const router = express.Router();

//specify the authentication
/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  Review.find({})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Review.findOne({ _id: id })
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


/* Post Review */
router.post('/', (req, res, next) => {
  const { name, rating, author, imgTag, genre, description, imgUrl, reviewbody } = req.body;
  const newReview = { name, rating, author, imgTag, genre, description, imgUrl, reviewbody };

  // Checking for improper input from the user
  // Check for bad ids
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  if (!rating) {
    const err = new Error('Missing `rating` in request body');
    err.status = 400;
    return next(err);
  }
  if (!author) {
    const err = new Error('Missing `author` in request body');
    err.status = 400;
    return next(err);
  }
  if (!imgTag) {
    const err = new Error('Missing `imgTag` in request body');
    err.status = 400;
    return next(err);
  }
  if (!genre) {
    const err = new Error('Missing `genre` in request body');
    err.status = 400;
    return next(err);
  }
  if (!description) {
    const err = new Error('Missing `description` in request body');
    err.status = 400;
    return next(err);
  }
  if (!imgUrl) {
    const err = new Error('Missing `imgUrl` in request body');
    err.status = 400;
    return next(err);
  }
  if (!reviewbody) {
    const err = new Error('Missing `reviewbody` in request body');
    err.status = 400;
    return next(err);
  }

  Review.create(newReview)
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
  const { name, description, genre, imgUrl } = req.body;
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

  const updateReview = { name, description, genre, imgUrl };

  Review.findOneAndUpdate({ _id: id }, updateReview, { new: true })
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
