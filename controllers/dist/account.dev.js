"use strict";

var _require = require("nodemon"),
    restart = _require.restart;

var User = require("../models/user");

var bcrypt = require('bcrypt');

var csurf = require('csurf');

exports.getLogin = function (req, res, next) {
  var errorMsg = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render('account/login', {
    title: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
    errorMessage: errorMsg,
    csrfToken: req.csrfToken()
  });
};

exports.postLogin = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var MyUser;
  User.findOne({
    username: username
  }).then(function (user) {
    if (!user) {
      //You can use query parameters to create alerts for users. This is a different approach.
      req.session.errorMessage = "Couldn't find a user with given username.";
      return res.redirect('/login');
    }

    MyUser = user;
    return bcrypt.compare(password, user.password);
  }).then(function (result) {
    if (!result) {
      req.session.errorMessage = "Password you have entered is wrong. Please try again.";
      return res.redirect('/login');
    }

    req.session.user = MyUser;
    req.session.isAuthenticated = true;
    return req.session.save(function (err) {
      var url = req.session.redirectTo || '/?login=success';
      delete req.session.redirectTo;
      res.redirect(url);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.getRegister = function (req, res, next) {
  res.render('account/register', {
    title: 'Register',
    path: '/register',
    result: req.query.result,
    isAuthenticated: req.session.isAuthenticated,
    csrfToken: req.csrfToken()
  });
};

exports.postRegister = function (req, res, next) {
  var username = req.body.username.toString().toLowerCase();
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({
    username: username
  }).then(function (user) {
    if (user) {
      return res.redirect('/register?result=exists');
    }

    return bcrypt.hash(password, 10);
  }).then(function (pass) {
    var user = new User({
      username: username,
      email: email,
      password: pass,
      cart: {
        items: []
      }
    });
    return user.save();
  }).then(function () {
    res.redirect('/login');
  }).then(function () {//console.log('Email sent to user '+ username +'.');
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.getReset = function (req, res, next) {
  var errorMsg = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render('account/reset', {
    title: 'Reset Password',
    path: '/reset-password',
    csrfToken: req.csrfToken()
  });
};

exports.postReset = function (req, res, next) {
  res.render('account/login', {
    title: 'Login',
    path: '/login'
  });
};

exports.getLogout = function (req, res, next) {
  req.session.destroy(function (err) {
    console.log(err);
    res.redirect('/?status=logout');
  });
};