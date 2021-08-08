const mongoose = require('mongoose');
const Product = require('./product');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cart: {
        items: [{
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    } 
});

userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    
    const updatedCartItems = [...this.cart.items];

    let itemQuantity = 1;
    if(index >= 0) {
        itemQuantity = this.cart.items[index].quantity+1;
        updatedCartItems[index].quantity = itemQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity,
        });
    }

    this.cart = {
        items: updatedCartItems
    }

    return this.save();
}

userSchema.methods.getCart = function() {
    const ids = this.cart.items.map(i=> {
        return i.productId;
    });

    return Product.find({
        _id: {
            $in: ids
        }
    })
    .select('name price imageUrl')
    .then(products => {
        return products.map(p=> {
            return {
                name: p.name,
                price: p.price,
                imageUrl: p.imageUrl, 
                quantity: this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString();
                }).quantity
            }
        });
    }).catch(err => console.log(err));
}

userSchema.methods.deleteCartItem = function(itemid){
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== itemid.toString();
    });

    this.cart.items = cartItems;

    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart.items = [];

    return this.save();
}



module.exports = mongoose.model('User',userSchema);
