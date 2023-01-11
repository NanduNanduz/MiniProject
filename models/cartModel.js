const mongoose = require('mongoose')
const product = require ('../models/productsModel')
const User = require('../models/userModel')
// const { Timestamp } = require('mongodb')



const cartSchema = new mongoose.Schema({
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
  cartItems: [
    {
      product:{type: mongoose.Schema.Types.ObjectId,ref:'Product',required: true},
      quantity:{ type: Number,default: 1},
      price:{type:Number, required: true}
      
    }
  ]
},{timestamps: true});



module.exports = mongoose.model('cart', cartSchema)


  // user: {
  //   type: String,
  //   required: true

  // },
  // total: {
  //   type: Number,
  //   default: 0,
  //   required: true
  // },


  // {timestamps: true});


  // userId:{
  //     type:mongoose.Types.ObjectId,
  //     ref:'User',
  //     required:true
  // },
  // payment:{
  //     type:String,
  //     required:true
  // },
  // country:{
  //     type:String,
  //     required:true
  // },
  // address:{
  //     type:String,
  //     required:true
  // },
  // city:{
  //     type:String,
  //     required:true
  // },
  // state:{
  //     type:String,
  //     required:true
  // },
  // zip:{
  //     type:String,
  //     required:true
  // },
  // createdAt:{
  //     type:Date,
  //     immutable:true,
  //     default:()=>Date.now()
  //   },
  





  //   products: [{
  //     name: {
  //       type: String,
  //       required: true
  //     },
  //     price: {
  //       type: Number,
  //       required: true
  //   },
  //     image: {
  //     type: String,
  //   },
  //   }]
  // })
  
 
  
  
  