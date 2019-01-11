'use strict';

const express = require('express');
const mongoose = require('mongoose');
//const passport = require('passport');
const Order = require('../models/orders');
const router = express.Router();

router.get('/', (req, res, next) => {
    Order.find({})
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  });
  
router.get('/:id', (req, res, next) => {

    //used to get a specific order
    const id = req.params.id;

    Order.find({_id: id})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    });
});

router.delete('/:id', (req, res, next) => {

    //used to get a specific order

    const id = req.params.id;

    Order.findOneAndRemove({_id: id})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    });
});


router.post('/', (req, res, next) => {

    //used to get a specific order

    const userId = req.user.id;
    const {address, items} = req.body;
    // determine the price based on the order
    const price = items.length * 60;
    const completed = false;
    const shipdate = new Date(2019,1,10);
    shipdate.setDate(shipdate.getDate() + 3);
    //create order object
    const newOrder = {address, userId, items, price, completed, shipdate};


    Order.create(newOrder)
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    });
});

// router.put('/:id', (req, res, next) => {

//     //used to get a specific order

//     console.log(req.body);
//     const id = req.params.id;

//     Order.findOneAndRemove({_id: id})
//     .then(results => {
//         res.json(results);
//     })
//     .catch(err => {
//         next(err);
//     });
// });

module.exports = router;