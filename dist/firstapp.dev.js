"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var session = require('express-session');

var mongodbStore = require('connect-mongodb-session')(session);

var csurf = require('csurf');

var multer = require('multer');

var mongoose = require('mongoose');

var path = require('path');

var cookieParser = require('cookie-parser'); // const mongoConnect = require('./util/database.js');
//Handwritten modules


var adminRoutes = require('./routes/admin.js');

var shopRoutes = require('./routes/shop.js');

var accountRoutes = require('./routes/account');

var errorController = require('./controllers/errors.js'); //MongoDB Server URI


var connString = ''; //Models

var User = require('./models/user');

var store = new mongodbStore({
  uri: connString,
  collection: 'mySessions'
});
app.set('view engine', 'pug'); //Bu zaten varsayılan olarak çalışıyor

app.set('views', './views');
app.use(session({
  secret: 'keyboard mouse',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000
  },
  store: store
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id).then(function (user) {
    req.user = user;
    next();
  })["catch"](function (err) {
    return console.log(err);
  });
});
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './public/img');
  },
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + '-' + req.user.username + '-' + Date.now() + path.extname(file.originalname));
  }
});
app.use(multer({
  storage: storage
}).single('imgurl'));
app.use(csurf());
app.use('/admin', adminRoutes);
app.use(accountRoutes);
app.use(shopRoutes);
app.use(errorController.pageNotFound);
mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log('Connected to mongodb.');
  app.listen(3000);
})["catch"](function (err) {
  console.log(err);
});