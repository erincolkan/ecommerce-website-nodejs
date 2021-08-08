"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var mongodb = require('mongodb');

var csurf = require('csurf');

var Product = require('../models/product');

var Category = require('../models/category');

var Order = require('../models/order');

module.exports.getIndex = function (req, res, next) {
  Product.find().then(function (products) {
    Category.find().then(function (categories) {
      res.render('shop/index', {
        title: 'Homepage',
        prdcts: products,
        categories: categories,
        path: '/'
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getProducts = function (req, res, next) {
  Product.find().then(function (products) {
    Category.find().then(function (categories) {
      res.render('shop/products.pug', {
        title: "Products",
        prdcts: products,
        categories: categories,
        path: '/products'
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getProduct = function (req, res, next) {
  Product.findById(req.params.productid).then(function (product) {
    Category.find({
      _id: {
        $in: product.categories
      }
    }).then(function (categories) {
      res.render('shop/product-detail', {
        title: product.name,
        product: product,
        categories: categories
      });
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getProductDetails = function (req, res, next) {
  res.render('shop/details', {
    title: 'Details',
    path: '/details'
  });
};

module.exports.getProductsByCategory = function (req, res, next) {
  Product.find({
    categories: req.params.categoryid
  }).then(function (products) {
    Category.find().then(function (categories) {
      res.render('shop/categories', {
        title: req.params.catgname + " Category",
        path: '/categories/' + req.params.catgname + '/' + req.params.categoryid,
        products: products,
        categories: categories
      });
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getCart = function (req, res, next) {
  req.user.populate('cart.items.productId').execPopulate().then(function (user) {
    res.render('shop/cart', {
      title: 'Cart',
      path: '/cart',
      pname: req.query.pname,
      action: req.query.action,
      prdcts: req.user.cart.items
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postCart = function (req, res, next) {
  var productid = req.body.productid;
  Product.findById(productid).then(function (product) {
    return req.user.addToCart(product);
  }).then(function () {
    res.redirect('/cart');
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postDeleteCartitem = function (req, res, next) {
  req.user.deleteCartItem(req.body.id);
  res.redirect('/cart?action=remove&pname=' + req.body.name);
};

module.exports.getOrders = function (req, res, next) {
  Order.find({
    'user.userId': req.user._id
  }, null, {
    sort: {
      date: -1
    }
  }).then(function (orders) {
    res.render('shop/orders', {
      title: 'Orders',
      orders: orders,
      action: req.query.action
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postOrder = function (req, res, next) {
  req.user.populate('cart.items.productId').execPopulate().then(function (user) {
    var order = new Order({
      user: {
        userId: req.user._id,
        username: req.user.username,
        email: req.user.email
      },
      items: user.cart.items.map(function (p) {
        return {
          product: {
            _id: p.productId._id,
            name: p.productId.name,
            price: p.productId.price,
            imageUrl: p.productId.imageUrl
          },
          quantity: p.quantity
        };
      })
    });
    return order.save();
  }).then(function () {
    return req.user.clearCart();
  }).then(function () {
    res.redirect('/orders?action=add');
  })["catch"](function (err) {
    return console.log(err);
  });
};