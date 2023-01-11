const User = require('../models/userModel')
const Product = require('../models/productsModel')
const Orders = require('../models/ordersModel');
const Address = require('../models/addressModel')

const Banner = require('../models/bannerModel')
const Offer = require('../models/offerModel')

const fast2sms = require('fast-two-sms')
const Razorpay = require('razorpay')

const express = require('express')
const { query } = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
let isLoggedin
isLoggedin = false
let userSession = false || {}
let newUser
let newOtp
let offer = {
    name: 'None',
    type: 'None',
    discount: 0,
    usedBy: false
}
let couponTotal = 0
let nocoupon


const loginLoad = async (req, res) => {
    try {
        res.render('login' ,{count: 0 })

    } catch (error) {
        console.log("error")
    }
}



const loadRegister = async (req, res) => {
    try {
        res.render('register',{count: 0 })

    } catch (error) {
        console.log("error")

    }

}

// const loadHome = async (req, res) => {
//     try {

//         res.render('home')

//     } catch (error) {
//         console.log("error")

//     }

// }




const loadHome = async (req, res) => {
    try {
        userSession = req.session
        const banner = await Banner.find({ is_active: 1 })
        console.log(banner);
        userSession.offer = offer;
        userSession.nocoupon = nocoupon;
        userSession.couponTotal = couponTotal;
        const productData = await Product.find()
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            res.render("home", { isLoggedin, banners: banner, products: productData, id: userSession.userId, count: userData.cart.totalqty, });
        } else {
            res.render("home", { isLoggedin, banners: banner, products: productData, id: userSession.userId, count: 0, });

        }
    } catch (error) {
        console.log(error.message);
    }
};






const insertUser = async (req, res) => {
    password = req.body.password;
    cpassword = req.body.cpassword;
    console.log(password);
    const alreadyExistingusername = await User.findOne({
        email: req.body.email,
    });
    const alreadyExistingmobile = await User.findOne({
        mobile: req.body.mobile,
    });
    try {
        if (req.body.password == req.body.cpassword) {
            if (!alreadyExistingusername && !alreadyExistingmobile) {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    password: req.body.password,
                    cpassword: req.body.cpassword,
                    is_admin: 0,
                    is_blocked: 0
                });
                const userData = await user.save();
                newUser = userData._id
                console.log(userData)
                if (userData) {

                    res.redirect('/verifyOtp')
                }
                else {
                    res.render('register', { message: "registration failed" })
                }
            } else if (alreadyExistingusername) {
                res.render('register', { message: "Username Already Exist" })

            } else {
                res.render('register', { message: "Mobile Number Already Exist" })

            }
        } else {
            res.render('register', { message: "Password Mismatch" })

        }
    } catch (error) {
        console.log(error)
    }
}


const varifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email)
        const userData = await User.findOne({ email: email });
        if (userData) {
            if (userData.is_blocked == 0) {
                console.log("block error")
                if (password == userData.password) {
                    if (userData.is_admin === 1) {
                        res.redirect('login')
                    }
                    else {
                        userSession = req.session
                        userSession.userId = userData._id
                        isLoggedin = true
                        console.log(userSession.userId)
                        console.log(isLoggedin)
                        res.redirect('/home')
                    }
                }
                else {
                    res.render('login')
                }
            }
            else {
                res.render('login', { message: "you are blocked" })
            }
        }
        else {
            res.render('login')
        }
    } catch (error) {
        console.log("error")
    }
}


const loadShop = async (req, res) => {
    userSession = req.session
    console.log("loadShop")
    try {
        const productData = await Product.find()
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            res.render('shop', { isLoggedin, product: productData, count: userData.cart.totalqty, id: userSession.userId })
            console.log(productData)
        } else {
            res.render('shop', { isLoggedin, product: productData, id: userSession.userId, count: 0 })

        }
    }
    catch (error) {
        console.log(error)

    }
}


const loadCategoryShop = async (req, res) => {
    const category = req.query.id
    console.log("loadShop")
    try {

        const productData = await Product.find({ category: category })
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            res.render('shop', { isLoggedin, product: productData, id: userSession.userId, count: userData.cart.totalqty })
            console.log(productData)
        } else {
            res.render('shop', { isLoggedin, product: productData, id: userSession.userId, count: 0 })

        }
    }
    catch (error) {
        console.log(error)

    }
}




const loadProductDetails = async (req, res) => {
    console.log(req.query.id)
    try {
        const productData = await Product.findById({ _id: req.query.id })
        if (userSession.userId) {

            const userData = await User.findById({ _id: userSession.userId })

            res.render('productDetails', { product: productData, count: userData.cart.totalqty, })
        } else {
            res.render('productDetails', { product: productData, count: 0 })

        }
    } catch (error) {
        console.log(error)

    }
}


const loadCart = async (req, res) => {
    try {

        console.log("cart page loading")
        userSession = req.session
        console.log(userSession.userId)
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            const completeUser = await userData.populate('cart.item.productId')
            if (userSession.couponTotal == 0) {
                //update coupon
                userSession.couponTotal = userData.cart.totalPrice;
            }
            console.log(completeUser)
            res.render('cart', { isLoggedin, id: userSession.userId, cartProducts: completeUser.cart, offer: userSession.offer, count: userData.cart.totalqty, couponTotal: userSession.couponTotal })
        } else {
            res.redirect('/login')
        }
        // res.render('cart')
    } catch (error) {
        console.log(error)
    }
}


//  const addToCart = async(req,res)=>{
//     const prodId = req.query.id
//     console.log('entered')
//     console.log(prodId)
//     userSession = req.session
//     const userId = req.user.id
//     const prodPrice = req.params.price

//     const product = {
//       items: prodId,
//       quantity: 1
//     }
//     };

const addToCart = async (req, res, next) => {
    try {
        const productId = req.query.id
        console.log(productId)
        userSession = req.session
        console.log(userSession)
        if (userSession) {
            const productData = await Product.findById({ _id: productId })
            console.log("product data")
            console.log(productData)
            // console.log(req.session.user_Id)
            console.log(userSession.userId)
            const userData = await User.findById({ _id: userSession.userId })
            console.log('userData')
            userData.addToCart(productData)
            // res.redirect('/cart')
            res.json({ status: true });
        }
        else {
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error)
    }
}


const deleteCart = async (req, res, next) => {
    console.log("cart delete starts")
    try {

        const productId = req.query.id
        userSession = req.session
        const userData = await User.findById({ _id: userSession.userId })
        userData.removefromCart(productId)
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }
}


const loadWishlist = async (req, res) => {
    try {
        userSession = req.session
        console.log(userSession.userId)
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            const completeUser = await userData.populate('wishlist.item.productId')

            res.render('wishlist', { isLoggedin, id: userSession.userId, wishlistProducts: completeUser.wishlist, count: userData.cart.totalqty })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}


const addToWishlist = async (req, res) => {
    const productId = req.query.id
    userSession = req.session
    if (userSession) {

        const userData = await User.findById({ _id: userSession.userId })
        const productData = await Product.findById({ _id: productId })
        userData.addToWishlist(productData)
        res.redirect('/wishlist')
    }
    else {
        res.redirect("/login")
    }
}


const addCartdelWishlist = async (req, res) => {
    console.log("delete  cart wishlist")
    const productId = req.query.id
    console.log(productId);
    userSession = req.session
    const userData = await User.findById({ _id: userSession.userId })
    const productData = await Product.findById({ _id: productId })
    const add = await userData.addToCart(productData)
    if (add) {
        const deleteData = await userData.removefromWishlist(productId);
        if (deleteData) {
            res.redirect('/cart')
        }
    }

}

const deleteWishlist = async (req, res) => {
    const productId = req.query.id
    userSession = req.session
    const userData = await User.findById({ _id: userSession.userId })
    userData.removefromWishlist(productId)
    res.redirect('/wishlist')
}



// const viewBlog = async (req, res) => {
//     const productId = req.query.id
//     userSession = req.session
//     const userData = await User.findById({ _id: userSession.userId })
//     try {
//         res.render('blog' ,{ isLoggedin, id: userSession.userId, count: userData.cart.totalqty } )
//     } catch (error) {
//         console.log(error)
//     }
// }

const viewBlog = async(req,res)=>{
    try{
        res.render('blog')
    }catch(error){
        console.log(error)
    }
}

const viewAbout = async(req,res)=>{
    try{
        res.render('about')
    }catch(error){
        console.log(error)
    }
}

const viewContact = async(req,res)=>{
    try{
        res.render('contact')
    }catch(error){
        console.log(error)
    }
}








// const loadCheckout = async (req, res) => {
//     try {
//       userSession = req.session
//       if (userSession.userId) {
//         const id = req.query.addressid;
//         const userData = await User.findById({ _id: userSession.userId })
//         const completeUser = await userData.populate('cart.item.productId')
//         const addressData = await Address.find({ userId: userSession.userId });
//         const selectAddress = await Address.findOne({ _id: id });
//         // const offer = await Offer.findOne({_id:userSession.userId})
//         console.log(userSession.offer)
//         console.log(completeUser)
//         console.log(completeUser.cart)


//         if (userSession.couponTotal == 0) {
//           //update coupon

//           userSession.couponTotal = userData.cart.totalPrice;

//         }

//         res.render('checkout', {

//           isLoggedin,
//           id: userSession.userId,
//           cartProducts: completeUser.cart,
//           offer: userSession.offer,
//           couponTotal: userSession.couponTotal,
//           nocoupon,
//           qty:completeUser.cart.item.qty,
//           addSelect: selectAddress,
//           userAddress: addressData,

//         });

//         nocoupon = false;

//       } else {

//         res.render('checkout', {
//           isLoggedin,
//           id: userSession.userId,
//           // offer: userSession.offer,
//           // couponTotal: userSession.couponTotal,

//         })
//       }
//     } catch (error) {
//       console.log(error.message)
//     }
//   }







const loadCheckout = async (req, res) => {
    try {
        userSession = req.session
        if (userSession.userId) {
            const id = req.query.addressid;

            const userData = await User.findById({ _id: userSession.userId })

            const completeUser = await userData.populate('cart.item.productId')
            const addressData = await Address.find({ userId: userSession.userId })
            const selectAddress = await Address.findOne({ _id:id })
            const offer = await Offer.findOne({ _id: userSession.userId })
            console.log('select address : ' + selectAddress)
            // console.log('UserData: ',userData);
            // console.log('completeUser: ',completeUser);


            if (userSession.couponTotal == 0) {
                //update coupon
                userSession.couponTotal = userData.cart.totalPrice;
            }


            res.render('checkout', { isLoggedin, id: userSession.userId, cartProducts: completeUser.cart, offer: userSession.offer, couponTotal: userSession.couponTotal, nocoupon, addSelect: selectAddress, userAddress: addressData, addSelect: selectAddress,count: userData.cart.totalqty, })
            nocoupon = false;

        } else {
            res.render('checkout', { isLoggedin, id: userSession.userId, count:0})

        }
    } catch (error) {
        console.log(error.message);
    }
}



const logout = async (req, res) => {
    try {
        userSession = req.session
        userSession.userId = null
        isLoggedin = false
        console.log(isLoggedin)
        res.redirect('/home')
        console.log("userloggedout")
    } catch (error) {
        console.log(error)
    }
}




const loadOtp = async (req, res) => {
    const userData = await User.findById({ _id: newUser })
    const otp = sendMessage(userData.mobile, res)
    newOtp = otp
    console.log('otp:', otp);
    res.render('../otpVerify', { otp: otp, user: newUser })
}

const verifyOtp = async (req, res) => {
    try {
        const otp = newOtp
        const userData = await User.findById({ _id: req.body.user })
        if (otp == req.body.otp) {
            userData.isVerified = 1
            const user = await userData.save()
            if (user) {
                res.redirect('/login')
            }
        } else {
            res.render('../otpVerify', { message: "Invalid OTP" })
        }

    } catch (error) {
        console.log(error.message)
    }
}


const sendMessage = function (mobile, res) {
    let randomOTP = Math.floor(Math.random() * 10000)
    var options = {
        authorization: "MSOj0bTnaP8phCARmWqtzkgEV4ZN2Ff9eUxXI7iJQ5HcDBKsL1vYiamnRcMxrsjDJboyFEXl0Sk37pZq",
        message: `your OTP verification code is ${randomOTP}`,
        numbers: [mobile]
    }
    //send this message
    fast2sms.sendMessage(options)
        .then((response) => {
            console.log("otp sent successfully")
        }).catch((error) => {
            console.log(error)
        })
    return randomOTP;
}





const storeOrder = async (req, res) => {
    try {
        console.log('storeorder')
        userSession = req.session
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            const completeUser = await userData.populate('cart.item.productId')
            // console.log('CompleteUser: ',completeUser);

            // userData.cart.totalPrice = userSession.couponTotal
            const updatedTotal = await userData.save()

            if (completeUser.cart.totalPrice > 0) {
                const order = Orders({
                    userId: userSession.userId,
                    payment: req.body.payment,
                    country: req.body.country,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    products: completeUser.cart,
                    offer: userSession.offer.name
                })
                let orderProductStatus = []
                for (let key of order.products.item) {
                    orderProductStatus.push(0)
                }

                order.productReturned = orderProductStatus

                const orderData = await order.save()

                userSession.currentOrder = orderData._id

                const offerUpdate = await Offer.updateOne({ name: userSession.offer.name }, { $push: { usedBy: userSession.userId } })

                if (req.body.payment == 'Cash-on-Dilevery') {
                    res.redirect('/order-success')
                } else if (req.body.payment == 'RazorPay') {
                    res.render('razorpay', { userId: userSession.userId, total: completeUser.cart.totalPrice , count: userData.cart.totalqty,})
                } else if (req.body.payment == 'PayPal') {
                    res.render('paypal', { userId: userSession.userId, total: completeUser.cart.totalPrice })
                } else {
                    res.redirect('/catalog')
                }
            } else { res.redirect('/checkout') }
        } else {
            res.redirect('/catalog')
        }
    } catch (error) {
        console.log(error.message);
    }
}






const loadSuccess = async (req, res) => {
    try {
        console.log("load success")
        userSession = req.session
        if (userSession.userId) {
            const userData = await User.findById({ _id: userSession.userId })
            const productData = await Product.find()
            console.log(userData.cart.item)
            for (let key of userData.cart.item) {
                console.log(key.productId, ' + ', key.Qty);
                for (let prod of productData) {

                    if (new String(prod._id).trim() == new String(key.productId).trim()) {
                        prod.stock = prod.stock - key.Qty
                        const a = await prod.save()
                        console.log(a)
                        // await prod.save()
                    }
                }
            }
            await Orders.updateOne({ userId: userSession.userId, _id: userSession.currentOrder }, { $set: { 'status': 'Build' } })
            await User.updateOne({ _id: userSession.userId }, { $set: { 'cart.item': [], 'cart.totalPrice': '0' ,'cart.totalqty':'0'} }, { multi: true })
            console.log("Order Built and Cart is Empty.");
        }
        userSession.couponTotal = 0

        res.render('orderSuccess',{count:0})
    } catch (error) {
        console.log(error.message);
    }
}




const viewOrder = async (req, res) => {
    try {
        userSession = req.session
        if (userSession.userId) {
            const id = req.query.id
            userSession.currentOrder = id
            const orderData = await Orders.findById({ _id: id })
            const userData = await User.findById({ _id: userSession.userId })
            await orderData.populate('products.item.productId')
            // console.log(orderData.products.item);
            res.render('viewOrder', { order: orderData, user: userData  , count: userData.cart.totalqty,})
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }
}


const cancelOrder = async (req, res) => {
    const id = req.query.id
    console.log(id);
    await Orders.deleteOne({ _id: id })
    res.redirect('/dashboard')

}





const userDashboard = async (req, res) => {
    try {
        userSession = req.session
        const userData = await User.findById({ _id: userSession.userId })
        const orderData = await Orders.find({ userId: userSession.userId })
        console.log("user dashboard")
        const addressData = await Address.find({ userId: userSession.userId })
        console.log(addressData);
        res.render('dashboard', { user: userData, userAddress: addressData, userOrders: orderData, count: userData.cart.totalqty })
    } catch (error) {
        console.log(error.message)
        console.log("end")
    }
}










const addAddress = async (req, res) => {
    try {
        userSession = req.session
        const addressData = Address({
            userId: userSession.userId,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            country: req.body.country,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            mobile: req.body.mno,
        })
        await addressData.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error.message)
    }
}


const deleteAddress = async (req, res) => {
    try {
        userSession = req.session
        id = req.query.id;
        await Address.findByIdAndDelete({ _id: id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error.message)
    }
}



// const editUser = async (req, res) => {
//     const id = req.query.id
//     const userData = await User.findById({ _id: id })
//     res.render('edit-user', { user: userData })
// }





const editUser = async (req, res) => {
    try {
      session = req.session;
      if (session.userId) {
        await User.findByIdAndUpdate(
          { _id: session.userId },
          {
            $set: {
              name: req.body.name,
              lname: req.body.lname,
              username: req.body.username,
              mobile: req.body.mobile,
            },
          }
        );
        res.redirect('/dashboard');
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.log(error.message);
    }
  };




const updateUser = async (req, res) => {
    const productData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mno } })
    res.redirect('/dashboard')
}



const razorpayCheckout = async (req, res) => {
    userSession = req.session
    const userData = await User.findById({ _id: userSession.userId })
    const completeUser = await userData.populate('cart.item.productId')
    var instance = new Razorpay({ key_id: 'rzp_test_JsWAF5zQlTrjuV', key_secret: 'gERCxgjTf4uyZQtjb952ydzb' })
    console.log(req.body);
    console.log(completeUser.cart.totalPrice);
    let order = await instance.orders.create({
        amount: completeUser.cart.totalPrice * 100,
        currency: "INR",
        receipt: "receipt#1",
    })
    res.status(201).json({
        success: true,
        order
    })
}




const currentBanner = async (req, res) => {
    try {
        const id = req.query.id
        await Banner.findOneAndUpdate({ is_active: 1 }, { $set: { is_active: 0 } })
        await Banner.findByIdAndUpdate({ _id: id }, { $set: { is_active: 1 } })
        res.redirect('/admin/loadBanners')
    } catch (error) {
        console.log(error.message)
    }
}



// const addCoupon = async (req, res) => {
//     try {
//         userSession = req.session
//         if (userSession.userId) {
//             const offer = { a: req.body.offer }
           
//             const userData = await User.findById({ _id: userSession.userId })
//             const offerData = await Offer.findOne({ name: offer.a })

//             if (offerData) {
//                 if (offerData.usedBy.includes(userSession.userId)) {
//                     nocoupon = true;
//                     userSession.offer.usedBy = true
                   
//                      res.redirect('/cart')
//                 } else {
//                     userSession.offer.name = offerData.name
//                     userSession.offer.type = offerData.type
//                     userSession.offer.discount = offerData.discount

//                     let updatedTotal = userData.cart.totalPrice - (userData.cart.totalPrice * userSession.offer.discount) / 100
//                     userSession.couponTotal = updatedTotal
//                     console.log(userSession)
//                     // res.redirect('/cart')
//                     res.json({updatedTotal})

//                 }


//             } else {

//                 res.redirect('/cart')

//             }

//         } else {
//             res.redirect('/cart')
//         }

//     } catch (error) {
//         console.log(error.message);
//     }
// }



const addCoupon = async(req,res)=>{
    try {
        userSession = req.session
        console.log("coupon added")

        if(userSession.userId){
            const userData =await User.findById({ _id:userSession.userId })
            const offerData = await Offer.findOne({name:req.body.offer})
            console.log(offerData);
            if(offerData){
                if(offerData.usedBy != userSession.userId){
                    userSession.offer.name = offerData.name
                    userSession.offer.type = offerData.type 
                    userSession.offer.discount = offerData.discount 
                    
                    let updatedTotal =userData.cart.totalPrice - (userData.cart.totalPrice * userSession.offer.discount)/100
                    userSession.couponTotal = updatedTotal
                    res.redirect('/cart')    
                }else{
                    // nocoupon = true;
                    userSession.offer.usedBy = true

                    res.redirect('/cart')
                }

                
            }else{


                res.redirect('/cart')

            }

        }else{
            res.redirect('/cart')
        }

    } catch (error) {
        console.log(error.message);
    }
}



const returnProduct = async (req, res) => {
    try {
      session = req.session;
      if ((session = req.session)) {
        const id = req.query.id;
        // console.log('id',new String(id));
        const productOrderData = await Orders.findById({
          _id: ObjectId(session.currentOrder),
        });
        // console.log('productOrderData.products.item[i].productId',new String(productOrderData.products.item[0].productId));
        const productData = await Product.findById({ _id: id });
        if (productOrderData) {
          for (let i = 0; i < productOrderData.products.item.length; i++) {
            if (
              new String(productOrderData.products.item[i].productId).trim() ===
              new String(id).trim()
            ) {
              productData.stock += productOrderData.products.item[i].qty;
              productOrderData.productReturned[i] = 1;
              console.log('found!!!');
              console.log('productData.stock', productData.stock);
              await productData.save().then(() => {
                console.log('productData saved');
              });
              console.log(
                'productOrderData.productReturned[i]',
                productOrderData.productReturned[i]
              );
              await productOrderData.save().then(() => {
                console.log('productOrderData saved');
              });
            } else {
              // console.log('Not at position: ',i);
            }
          }
          res.redirect('/dashboard');
        }
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  





module.exports = {
    loginLoad,
    loadRegister,
    loadHome,
    insertUser,
    varifyLogin,
    loadShop,
    loadProductDetails,
    loadCart,
    addToCart,
    deleteCart,
    loadWishlist,
    addToWishlist,
    logout,
    loadCategoryShop,
    loadCheckout,
    verifyOtp,
    loadOtp,
    sendMessage,
    cancelOrder,
    viewOrder,
    loadSuccess,
    storeOrder,
    addCartdelWishlist,
    deleteWishlist,
    addAddress,
    deleteAddress,
    userDashboard,
    editUser,
    updateUser,
    razorpayCheckout,
    currentBanner,
    addCoupon,
    viewBlog,
    returnProduct,
    viewAbout,
    viewContact



}