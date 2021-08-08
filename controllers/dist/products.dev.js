"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var Product = require('../models/product');

module.exports.getProducts = function (req, res, next) {
  var products = Product.sendProductList();
  res.render('index', {
    title: 'Homepage',
    prdcts: products,
    path: '/'
  });
};

module.exports.postAddProducts = function (req, res, next) {
  var product = new Product(req.body.name, req.body.price, req.body.imgurl, req.body.description);
  product.saveProduct();
  res.redirect('/');
};

module.exports.getAddProducts = function (req, res, next) {
  res.render('add-product', {
    title: 'Add a New Product',
    path: '/admin/add-product'
  });
};