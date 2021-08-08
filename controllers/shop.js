const express = require('express');
const router = express.Router();
const path = require('path');
const mongodb = require('mongodb');
const csurf = require('csurf');

const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');


module.exports.getIndex = (req,res,next) => {
    Product.find().then(products => {
        Category.find().then(categories => {
            res.render('shop/index', {
                title: 'Homepage',
                prdcts: products,
                categories: categories,

                path: '/',
            });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));   
}

module.exports.getProducts = (req,res,next) => {
    Product.find().then(products => {
        Category.find().then(categories => {
            res.render('shop/products.pug', {
                title: "Products",
                prdcts: products,
                categories: categories,
                path: '/products',
            });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
};

module.exports.getProduct = (req,res,next) => {
    Product.findById(req.params.productid).then(product => {
        Category.find({_id: {$in: product.categories}}).then(categories => {
            res.render('shop/product-detail', {
                title : product.name,
                product : product,
                categories: categories,
            });
        });        
    }).catch(err => console.log(err));
}

module.exports.getProductDetails = (req,res,next) => {
    res.render('shop/details', {
        title: 'Details', 
        path: '/details'
    });
}

module.exports.getProductsByCategory = (req,res,next) => {
    Product.find({categories: req.params.categoryid}).then(products => {
        Category.find().then(categories => {
            res.render('shop/categories', {
                title: req.params.catgname+" Category",
                path: '/categories/'+req.params.catgname+'/'+req.params.categoryid,
                products: products,
                categories: categories,
            });
        });
    }).catch(err => console.log(err));
}

module.exports.getCart = (req,res,next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                pname: req.query.pname,
                action: req.query.action,
                prdcts: req.user.cart.items,
            });
        }).catch(err => console.log(err));
}

module.exports.postCart = (req,res,next) => {
    const productid = req.body.productid;

    Product.findById(productid).then(product => {
        return req.user.addToCart(product);
    }).then(() => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
}

module.exports.postDeleteCartitem = (req,res,next) => {
    req.user.deleteCartItem(req.body.id);
    res.redirect('/cart?action=remove&pname='+ req.body.name);
}

module.exports.getOrders = (req,res,next) => {
    Order.find({'user.userId': req.user._id}, null, {sort: {date: -1}})
    .then(orders => {
        res.render('shop/orders', {
            title: 'Orders',
            orders: orders,
            action: req.query.action,
        });
    }).catch(err => console.log(err));
}

module.exports.postOrder = (req,res,next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const order = new Order({
                user: {
                    userId: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                },
                items: user.cart.items.map(p => {
                    return {
                        product: {
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            imageUrl: p.productId.imageUrl
                        },
                        quantity: p.quantity
                    }
                }),
            });

            return order.save();
        }).then(() => {
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders?action=add');
        }).catch(err => console.log(err));
}