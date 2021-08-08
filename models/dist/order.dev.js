"use strict";

var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    "default": Date.now
  },
  items: [{
    product: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }]
});
module.exports = mongoose.model('Order', orderSchema);