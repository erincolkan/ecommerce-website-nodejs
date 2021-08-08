//Node Modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { equal } = require('assert');

//Handwritten Modules
const adminController = require('../controllers/admin.js');
const checkAuth = require('../middleware/authentication').checkAuth;
const isAdmin = require('../middleware/authentication').isAdmin;
const csrf = require('../middleware/locals').csrf;

//Product middlewares
router.get('/add-product', csrf, isAdmin, adminController.getAddProducts);

router.post('/add-product', csrf, isAdmin, adminController.postAddProducts);

router.get('/edit-product/:productid', csrf, isAdmin, adminController.getEditProduct);

router.post('/edit-product', csrf, isAdmin, adminController.postEditProduct);

router.get('/products',csrf, isAdmin, adminController.getProducts);

router.post('/delete-product',csrf, isAdmin, adminController.postDeleteProduct);

//Category middlewares
router.get('/add-category',csrf, isAdmin, adminController.getAddCategory);

router.post('/add-category',csrf, isAdmin, adminController.postAddCategory);

router.get('/categories',csrf, isAdmin, adminController.getCategories);

router.post('/delete-category',csrf, isAdmin, adminController.postDeleteCategory);

router.get('/edit-category/:categoryid',csrf, isAdmin, adminController.getEditCategory);

router.post('/edit-category',csrf, isAdmin, adminController.postEditCategory);

module.exports = router;
