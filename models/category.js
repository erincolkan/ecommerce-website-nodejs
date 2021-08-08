const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
});

module.exports = mongoose.model('Category', categorySchema);

// const getDb = require('../util/database').getdb;
// const mongodb = require('mongodb');

// class Category {
//     constructor(name, description, id){
//         this.name = name;
//         this.description = description;
//         this._id = id ? new mongodb.ObjectID(id): null;
//     }

//     static findall(){
//         const db = getDb();
        
//         return db.collection('categories').find().toArray().then(categories => {
//             return categories;
//         }).catch(err => console.log(err));
//     }

//     save(){
//         let db = getDb();

//         //Burada tek metod icinde iki is yapiyoruz.
//         if (this._id) {
//             db = db.collection('categories').updateOne({_id: this._id}, {$set: this});
//         } else {
//             db = db.collection('categories').insertOne(this);
//         }

//         db.then().catch(err => console.log(err));
//     }

//     static findById(categoryid){
//         const db = getDb();

//         return db.collection('categories').findOne({
//             _id : new mongodb.ObjectID(categoryid),
//         }).then(category => {
//             return category;
//         }).catch(err => console.log(err));
//     }

//     static delete(categoryid){
//         const db = getDb();

//         db.collection('categories').deleteOne({
//             _id: new mongodb.ObjectID(categoryid),
//         }).catch(err => console.log(err));
//     }

//     // //Bu metod lazim mi bilmiyorum.
//     // insertItem(product){
//     //     const db = getDb();

//     //     this.items.push(product);

//     //     db.collection('categories').updateOne({
//     //         _id : this._id 
//     //     } , {
//     //         $set : this
//     //     }).then().catch(err => console.log(err));
//     // }
// }

// module.exports = Category;