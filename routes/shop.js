const { SSL_OP_PKCS1_CHECK_1 } = require('constants');
const express = require('express');
const router = express.Router();
const path = require('path');

//My Modules
const admin = require('./admin.js');
const shopController = require('../controllers/shop.js');
const checkAuth = require('../middleware/authentication').checkAuth;
const csrf = require('../middleware/locals').csrf;

//middleware 2
router.get('/', csrf, shopController.getIndex);

router.get('/products', csrf, shopController.getProducts);

router.get('/products/:productid',csrf, shopController.getProduct);

router.get('/details', csrf, shopController.getProductDetails);

router.get('/cart', csrf, checkAuth, shopController.getCart);

router.post('/cart', csrf, checkAuth, shopController.postCart);

router.post('/delete-cartitem',csrf, checkAuth, shopController.postDeleteCartitem);

router.get('/orders',csrf, checkAuth, shopController.getOrders);

router.get('/categories/:catgname/:categoryid',csrf, shopController.getProductsByCategory);

router.post('/create-order',csrf, checkAuth, shopController.postOrder);

module.exports = router;