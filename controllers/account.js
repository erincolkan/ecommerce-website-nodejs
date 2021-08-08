const { restart } = require("nodemon");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const csurf = require('csurf');


exports.getLogin = (req,res,next) => {
    var errorMsg = req.session.errorMessage;
    delete req.session.errorMessage;
    
    res.render('account/login', {
        title: 'Login',
        path: '/login',
        isAuthenticated: req.session.isAuthenticated,
        errorMessage: errorMsg,
        csrfToken: req.csrfToken()
    });
}

exports.postLogin = (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    let MyUser;
    User.findOne({username: username}).then(user => {
        if(!user){
            //You can use query parameters to create alerts for users. This is a different approach.
            req.session.errorMessage = "Couldn't find a user with given username."
            return res.redirect('/login');
        }
        
        MyUser = user;
        return bcrypt.compare(password, user.password);
    }).then(result => {
        if(!result) {
            req.session.errorMessage = "Password you have entered is wrong. Please try again.";
            return res.redirect('/login');
        }

        req.session.user = MyUser;
        req.session.isAuthenticated = true;
        return req.session.save(function(err) {
            var url = req.session.redirectTo || '/?login=success';
            delete req.session.redirectTo;
            res.redirect(url);
        });
    }).catch(err => console.log(err));
}

exports.getRegister = (req,res,next) => {
    res.render('account/register', {
        title: 'Register',
        path: '/register',
        result: req.query.result,
        isAuthenticated: req.session.isAuthenticated,
        csrfToken: req.csrfToken()
    });
}

exports.postRegister = (req,res,next) => {
    const username = req.body.username.toString().toLowerCase();
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({username: username}).then(user => {
        if(user){
           return res.redirect('/register?result=exists');
        } 

        return bcrypt.hash(password, 10);
    }).then((pass) => {
        const user = new User({
            username: username,
            email: email,
            password: pass,
            cart: {
                items: []
            }
        });

        return user.save();
    }).then(() => {
        res.redirect('/login');

    }).then(() => {
        //console.log('Email sent to user '+ username +'.');
    }).catch(err => console.log(err));
}

exports.getReset = (req,res,next) => {
    var errorMsg = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/reset', {
        title: 'Reset Password',
        path: '/reset-password',
        csrfToken: req.csrfToken(),
    });
}

exports.postReset = (req,res,next) => {
    res.render('account/login', {
        title: 'Login',
        path: '/login',
    });
}

exports.getLogout = (req,res,next) => {
    req.session.destroy( err => {
        console.log(err);
        res.redirect('/?status=logout');
    });
}

