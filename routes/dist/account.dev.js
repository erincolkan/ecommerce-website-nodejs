"use strict";

var express = require('express');

var router = express.Router();

var accountController = require('../controllers/account');

router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);
router.get('/register', accountController.getRegister);
router.post('/register', accountController.postRegister);
router.get('/logout', accountController.getLogout);
router.get('/reset-password', accountController.getReset);
router.post('/reset-password', accountController.postReset);
module.exports = router;