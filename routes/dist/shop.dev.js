"use strict";

var _require = require('constants'),
    SSL_OP_PKCS1_CHECK_1 = _require.SSL_OP_PKCS1_CHECK_1;

var express = require('express');

var router = express.Router();

var path = require('path'); //My Modules


var admin = require('./admin.js');

var shopController = require('../controllers/shop.js');

var checkAuth = require('../middleware/authentication').checkAuth;

var csrf = require('../middleware/locals').csrf; //middleware 2


router.get('/', csrf, shopController.getIndex);
router.get('/products', csrf, shopController.getProducts);
router.get('/products/:productid', csrf, shopController.getProduct);
router.get('/details', csrf, shopController.getProductDetails);
router.get('/cart', csrf, checkAuth, shopController.getCart);
router.post('/cart', csrf, checkAuth, shopController.postCart);
router.post('/delete-cartitem', csrf, checkAuth, shopController.postDeleteCartitem);
router.get('/orders', csrf, checkAuth, shopController.getOrders);
router.get('/categories/:catgname/:categoryid', csrf, shopController.getProductsByCategory);
router.post('/create-order', csrf, checkAuth, shopController.postOrder);
module.exports = router;