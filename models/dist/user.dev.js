"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var mongoose = require('mongoose');

var Product = require('./product');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    "default": false
  },
  cart: {
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
});

userSchema.methods.addToCart = function (product) {
  var index = this.cart.items.findIndex(function (cp) {
    return cp.productId.toString() === product._id.toString();
  });

  var updatedCartItems = _toConsumableArray(this.cart.items);

  var itemQuantity = 1;

  if (index >= 0) {
    itemQuantity = this.cart.items[index].quantity + 1;
    updatedCartItems[index].quantity = itemQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: itemQuantity
    });
  }

  this.cart = {
    items: updatedCartItems
  };
  return this.save();
};

userSchema.methods.getCart = function () {
  var _this = this;

  var ids = this.cart.items.map(function (i) {
    return i.productId;
  });
  return Product.find({
    _id: {
      $in: ids
    }
  }).select('name price imageUrl').then(function (products) {
    return products.map(function (p) {
      return {
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        quantity: _this.cart.items.find(function (i) {
          return i.productId.toString() === p._id.toString();
        }).quantity
      };
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

userSchema.methods.deleteCartItem = function (itemid) {
  var cartItems = this.cart.items.filter(function (item) {
    return item.productId.toString() !== itemid.toString();
  });
  this.cart.items = cartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);