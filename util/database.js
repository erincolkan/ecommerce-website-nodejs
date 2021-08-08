// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// let _db;

// const mongoConnect = (callback) => {
//     MongoClient.connect('mongodb+srv://admin:aaItsWWq6EmcFo8d@cluster0.sdvi3.mongodb.net/nodeapp?retryWrites=true&w=majority').then( client => {
//         console.log('Connected to server.');
//         _db = client.db();
//         callback();
//     }).catch((err) => {console.log(err);});
// }

// const getdb = () => {
//     if(_db){
//         return _db;
//     }
//     throw 'No database'
// }

// exports.getdb = getdb;
// exports.mongoConnect = mongoConnect;

