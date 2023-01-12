const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isAvailable:{
        type: Number,
        default:1
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
      image1: {
        type: String,
        // required: true,
      },
       image2: {
        type: String,
        // required: true,
      }, 
     

})

module.exports = mongoose.model('Product', productSchema)
