"use strict";

//Node Modules
var express = require('express');

var bodyParser = require('body-parser');

var router = express.Router();

var _require = require('assert'),
    equal = _require.equal; //Handwritten Modules


var adminController = require('../controllers/admin.js');

var checkAuth = require('../middleware/authentication').checkAuth;

var isAdmin = require('../middleware/authentication').isAdmin;

var csrf = require('../middleware/locals').csrf; //Product middlewares


router.get('/add-product', csrf, isAdmin, adminController.getAddProducts);
router.post('/add-product', csrf, isAdmin, adminController.postAddProducts);
router.get('/edit-product/:productid', csrf, isAdmin, adminController.getEditProduct);
router.post('/edit-product', csrf, isAdmin, adminController.postEditProduct);
router.get('/products', csrf, isAdmin, adminController.getProducts);
router.post('/delete-product', csrf, isAdmin, adminController.postDeleteProduct); //Category middlewares

router.get('/add-category', csrf, isAdmin, adminController.getAddCategory);
router.post('/add-category', csrf, isAdmin, adminController.postAddCategory);
router.get('/categories', csrf, isAdmin, adminController.getCategories);
router.post('/delete-category', csrf, isAdmin, adminController.postDeleteCategory);
router.get('/edit-category/:categoryid', csrf, isAdmin, adminController.getEditCategory);
router.post('/edit-category', csrf, isAdmin, adminController.postEditCategory);
module.exports = router;