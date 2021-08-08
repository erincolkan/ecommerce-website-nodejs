"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var csurf = require('csurf');

var fs = require('fs');

var _require = require('../routes/shop'),
    use = _require.use;

var Product = require('../models/product');

var Category = require('../models/category');

var mongoose = require('mongoose'); //find() methodundan sonra populate() metodu sayesinde tablolar arasi iliski kurabilirsin. biz sadece userId sakliyoruz
//ama populate metoduyla o userid'den user tablosundaki o id'ye sahip user'in tum bilgilerine erisebilirsin. guzel ozellik.


module.exports.getProducts = function (req, res, next) {
  Product.find().populate('userId', 'username').then(function (products) {
    res.render('admin/products', {
      prdcts: products,
      title: 'Products List',
      path: '/admin/products',
      action: req.query.action
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postAddProducts = function (req, res, next) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.file;
  var description = req.body.description;
  var categories = req.body.categoryids;

  if (!image) {
    return Category.find().then(function (categories) {
      res.render('admin/add-product', {
        title: "New Product",
        path: "/admin/add-product",
        errorMessage: "Please upload an image for your advert.",
        categories: categories,
        inputs: {
          name: name,
          price: price,
          description: description
        }
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  }

  var product = new Product({
    name: name,
    price: price,
    imageUrl: image.filename,
    description: description,
    categories: categories,
    userId: req.user._id
  });
  product.save().then(function () {
    res.redirect("/admin/products?action=add&pname=" + req.body.name);
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getAddProducts = function (req, res, next) {
  Category.find().then(function (categories) {
    res.render('admin/add-product', {
      title: 'New Product',
      path: '/admin/add-product',
      categories: categories,
      inputs: {
        name: "",
        description: "",
        price: ""
      }
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getEditProduct = function (req, res, next) {
  Product.findById(req.params.productid).then(function (product) {
    Category.find().then(function (categories) {
      //Burada her bir kategoriye selected diye bir ozellik ekliyoruz.
      categories = categories.map(function (category) {
        product.categories.find(function (item) {
          if (item == category._id) {
            category.selected = true;
          }
        });
        return category;
      });
      res.render('admin/edit-product', {
        title: 'Edit product',
        product: product,
        path: '/admin/edit-product',
        categories: categories
      });
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postEditProduct = function (req, res, next) {
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var description = req.body.description;
  var categories = req.body.categoryids;
  var userId = req.user._id;
  var image = req.file;
  Product.findOne({
    _id: id,
    userId: userId
  }).then(function (product) {
    if (!product) {
      return res.redirect('/');
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.categories = categories;

    if (image) {
      fs.unlink('public/img/' + product.imageUrl, function (err) {
        err ? console.log(err) : "";
      });
      product.imageUrl = image.filename;
    }

    return product.save();
  }).then(function () {
    res.redirect('/admin/products?action=edit&pname=' + req.body.name);
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postDeleteProduct = function (req, res, next) {
  Product.findOne({
    _id: req.body.id,
    userId: req.user._id
  }).then(function (product) {
    if (!product) {
      return res.redirect('/');
    }

    fs.unlink('public/img/' + product.imageUrl, function (err) {
      err ? console.log(err) : "";
    });
    return Product.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    });
  }).then(function () {
    res.redirect('/admin/products?action=delete');
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getAddCategory = function (req, res, next) {
  res.render('admin/add-category', {
    title: 'New Category',
    path: '/admin/add-category'
  });
};

module.exports.postAddCategory = function (req, res, next) {
  var catg = new Category({
    name: req.body.name,
    description: req.body.description
  });
  catg.save().then(function () {
    res.redirect('/admin/categories?action=add&catgname=' + req.body.name);
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getCategories = function (req, res, next) {
  Category.find().then(function (categories) {
    res.render('admin/categories', {
      title: 'Categories',
      categories: categories,
      path: '/admin/categories',
      action: req.query.action,
      catgname: req.query.catgname
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postDeleteCategory = function (req, res, next) {
  Category.findByIdAndDelete(req.body.id).then(function () {
    res.redirect('/admin/categories?action=delete&catgname=' + req.body.name);
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.getEditCategory = function (req, res, next) {
  Category.findById(req.params.categoryid).then(function (category) {
    res.render('admin/edit-category', {
      title: "Edit Category",
      path: '/admin/categories',
      category: category
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

module.exports.postEditCategory = function (req, res, next) {
  Category.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    description: req.body.description
  }).then(function () {
    res.redirect('/admin/categories?action=edit&catgname=' + req.body.name);
  })["catch"](function (err) {
    return console.log(err);
  });
};