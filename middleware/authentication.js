module.exports.checkAuth = (req,res,next) => {
    if(!req.session.isAuthenticated){
        req.session.redirectTo = req.url;
        return res.redirect('/login?status=denied');
    }
    
    next();
}

module.exports.isAdmin = (req,res,next) => {
    if(!req.session.isAuthenticated){
        req.session.redirectTo = req.url;
        return res.redirect('/login?status=denied');
    }

    if(!req.user.isAdmin){
        return res.redirect('/');
    }

    next();
}

