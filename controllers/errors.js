module.exports.pageNotFound = (req,res, next) => { 
    res.render('../views/error/fourofour', {title: 'Page not found'});
    res.status(404);
}