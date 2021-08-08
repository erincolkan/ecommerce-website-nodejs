const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const multer = require('multer');

const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
// const mongoConnect = require('./util/database.js');

//Handwritten modules
const adminRoutes =  require('./routes/admin.js');
const shopRoutes =  require('./routes/shop.js');
const accountRoutes = require('./routes/account');
const errorController = require('./controllers/errors.js');

//MongoDB Server URI
const connString = '';

//Models
const User = require('./models/user');

var store = new mongodbStore({
    uri: connString,
    collection: 'mySessions'
});

app.set('view engine', 'pug');
//Bu zaten varsayılan olarak çalışıyor
app.set('views', './views');

app.use(session({
    secret: 'keyboard mouse',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
    },
    store: store
}));

app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next) => {
    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user._id).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.user.username + '-' + Date.now() + path.extname(file.originalname));
    }
  });
   
  app.use(multer({storage: storage}).single('imgurl'));

app.use(csurf());

app.use('/admin', adminRoutes);
app.use(accountRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoose.connect(connString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to mongodb.');
    app.listen(3000);
}).catch(err => {
    console.log(err);
})



