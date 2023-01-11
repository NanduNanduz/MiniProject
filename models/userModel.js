const mongoose = require("mongoose")
const product = require("../models/productsModel")
const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address:{
        type:String,
    
    },
    mobile: {
        type: String,
        required: true
    },
  
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        default: 0,

    },
    is_blocked: {
        type: Number,
        default: 0
    },
    address: {
        Details: [
            {
                addId: {
                    type:mongoose.Types.ObjectId,
                    ref: 'Address'
                },
            },
        ],
    },
    cart: {
        item: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                Qty: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                },
            },

        ],
        totalPrice: {
            type: Number,
            default: 0
        },
        totalqty:{
            type:Number,
            default:0
        }
    },
    wishlist: {
        item: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            price: {
                type: Number
            },
        }]
    }
});



userSchema.methods.addToCart = function (product) {
    const cart = this.cart
    console.log(cart);
    const isExisting = cart.item.findIndex(objInItems => {
        return new String(objInItems.productId).trim() == new String(product._id).trim()
    })
    if (isExisting >= 0) {
        cart.item[isExisting].Qty += 1
    } else {
        cart.item.push({
            productId: product._id, name: product.name,
            Qty: 1, price: product.price
        })
    }
    cart.totalPrice += product.price
    cart.totalqty+=1
    console.log("User in schema:", this);
    return this.save()
}
userSchema.methods.removefromCart =async function (productId){
    const cart = this.cart
    const isExisting = cart.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
    if(isExisting >= 0){
       
        const prod = await product.findById(productId)
        cart.totalPrice -= prod.price * cart.item[isExisting].Qty
        cart.totalqty-=cart.item[isExisting].Qty
        cart.item.splice(isExisting,1)
        console.log("User in schema:",this);
        return this.save()
    }
}



userSchema.methods.addToWishlist = function (product) {
    const wishlist = this.wishlist
    const isExisting = wishlist.item.findIndex(objInItems => {
        return new String(objInItems.productId).trim() == new String(product._id).trim()
    })
    if (isExisting >= 0) {

    } else {
        wishlist.item.push({
            productId: product._id,
            price: product.price
        })
    }
    return this.save()
}

userSchema.methods.removefromWishlist =async function (productId){
    const wishlist = this.wishlist
    const isExisting = wishlist.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
    if(isExisting >= 0){
        const prod = await product.findById(productId)
        wishlist.item.splice(isExisting,1)
        return this.save()
    }
}


module.exports = mongoose.model('User', userSchema)