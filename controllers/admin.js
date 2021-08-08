const express = require('express');
const router = express.Router();
const path = require('path');
const csurf = require('csurf');
const fs = require('fs');

const { use } = require('../routes/shop');
const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');

//find() methodundan sonra populate() metodu sayesinde tablolar arasi iliski kurabilirsin. biz sadece userId sakliyoruz
//ama populate metoduyla o userid'den user tablosundaki o id'ye sahip user'in tum bilgilerine erisebilirsin. guzel ozellik.
module.exports.getProducts = (req,res,next) => {
    Product.find()
    .populate('userId','username')
    .then(products => {
        res.render('admin/products', {
            prdcts: products,
            title: 'Products List',
            path : '/admin/products',
            action : req.query.action,
        });
    }).catch(err => console.log(err));
};

module.exports.postAddProducts = (req,res,next) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    const description = req.body.description;
    const categories = req.body.categoryids;

    if(!image) {
        return Category.find().then(categories => {
            res.render('admin/add-product', {
                title: "New Product",
                path: "/admin/add-product",
                errorMessage: "Please upload an image for your advert.",
                categories: categories,
                inputs: {
                    name: name,
                    price: price,
                    description: description
                }
            });
        }).catch(err => console.log(err));
    }

    const product = new Product({
        name: name,
        price: price,
        imageUrl: image.filename,
        description: description,
        categories: categories,
        userId: req.user._id,
    });

    product.save().then(() => {
        res.redirect("/admin/products?action=add&pname="+req.body.name);
    }).catch(err => console.log(err));
};

module.exports.getAddProducts = (req,res,next) => {
    Category.find().then(categories => {
        res.render('admin/add-product', {
            title: 'New Product',
            path: '/admin/add-product',
            categories: categories,
            inputs: {
                name: "",
                description: "",
                price: ""
            }
        });
    }).catch(err => console.log(err));   
}

module.exports.getEditProduct = (req,res,next) => {
    Product.findById(req.params.productid).then(product => {
        Category.find().then(categories => {
            //Burada her bir kategoriye selected diye bir ozellik ekliyoruz.
            categories = categories.map(category => {
                product.categories.find(item => {
                    if(item == category._id){
                        category.selected = true;
                    }
                });

                return category;
            });

            res.render('admin/edit-product', {
                title: 'Edit product',
                product: product,
                path: '/admin/edit-product',
                categories: categories,
            }); 
        });   
    }).catch(err => console.log(err));
}

module.exports.postEditProduct = (req,res,next) => {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const categories = req.body.categoryids;
    const userId =  req.user._id;
    const image = req.file;

    Product.findOne({_id: id, userId: userId}).then(product => {
        if(!product){
            return res.redirect('/');
        }

        product.name = name;
        product.price = price;
        product.description = description;
        product.categories = categories;

        if (image) {
            fs.unlink('public/img/'+product.imageUrl, err => {err ? console.log(err): ""});
            product.imageUrl = image.filename;
        }

        return product.save();
    }).then(() => {
        res.redirect('/admin/products?action=edit&pname='+req.body.name);
    }).catch(err => console.log(err));

}

module.exports.postDeleteProduct = (req,res,next) => {
    Product.findOne({_id: req.body.id, userId: req.user._id}).then(product => {
        if(!product){
            return res.redirect('/');
        }

        fs.unlink('public/img/'+product.imageUrl, err => {err ? console.log(err): ""});
        return Product.deleteOne({_id: req.body.id, userId: req.user._id});
        
    }).then( () => {
        res.redirect('/admin/products?action=delete');
    }).catch(err => console.log(err));
}

module.exports.getAddCategory = (req,res,next) => {
    res.render('admin/add-category', {
        title: 'New Category',
        path: '/admin/add-category',
    });
}

module.exports.postAddCategory = (req,res,next) => {
    const catg = new Category({
        name: req.body.name, 
        description: req.body.description
    });

    catg.save().then(() => {
        res.redirect('/admin/categories?action=add&catgname='+req.body.name);
    }).catch(err => console.log(err));
}

module.exports.getCategories = (req,res,next) => {
    Category.find().then(categories => {
        res.render('admin/categories', {
            title: 'Categories',
            categories: categories,
            path: '/admin/categories',
            action: req.query.action,
            catgname: req.query.catgname,
        });
    }).catch(err => console.log(err));
}

module.exports.postDeleteCategory = (req,res,next) => {
    Category.findByIdAndDelete(req.body.id).then(() => {
        res.redirect('/admin/categories?action=delete&catgname='+req.body.name);
    }).catch(err => console.log(err));
}

module.exports.getEditCategory = (req,res,next) => {
    Category.findById(req.params.categoryid).then(category => {
        res.render('admin/edit-category', {
            title: "Edit Category",
            path: '/admin/categories',
            category: category,
        });
    }).catch(err => console.log(err));
}

module.exports.postEditCategory = (req,res,next) => {
    Category.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        description: req.body.description,
    }).then(() => {
        res.redirect('/admin/categories?action=edit&catgname='+req.body.name);
    }).catch(err => console.log(err));
}
