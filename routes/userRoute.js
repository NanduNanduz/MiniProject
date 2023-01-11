const express = require("express");
const user_route = express();



const userControllers = require("../controllers/userControllers");
const userMiddleware = require('../middleware/userMiddleware')
const Orders = require('../models/ordersModel')
const Offer = require('../models/offerModel')


user_route.use('/', express.static('public'))
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');


let isLoggedin
isLoggedin = false
let userSession = false || {}



user_route.get('/', userControllers.loadHome);
user_route.get('/register', userMiddleware.isLogout, userControllers.loadRegister);
user_route.get('/home', userControllers.loadHome);
user_route.get('/login', userMiddleware.isLogout, userControllers.loginLoad);
user_route.get('/shop', userControllers.loadShop);
user_route.get('/productDetails', userControllers.loadProductDetails);
user_route.get('/cart', userControllers.loadCart);

user_route.get('/wishlist', userControllers.loadWishlist)
user_route.get('/addtowishlist', userMiddleware.isLogin, userControllers.addToWishlist)
user_route.get('/add-to-cart-delete-wishlist',userControllers.addCartdelWishlist)
user_route.get('/delete-wishlist',userControllers.deleteWishlist)

user_route.get('/addToCart', userMiddleware.isLogin, userControllers.addToCart);
user_route.get('/delete-cart',userControllers.deleteCart)

user_route.get('/loadCategoryShop', userControllers.loadCategoryShop)

user_route.get('/checkout', userControllers.loadCheckout)
user_route.post('/checkout',userMiddleware.isLogin,userControllers.storeOrder)

user_route.get('/verifyOtp', userControllers.loadOtp)
user_route.post('/verifyOtp', userControllers.verifyOtp)


user_route.get('/edit-user',userMiddleware.isLogin,userControllers.editUser)
user_route.post('/edit-user',userControllers.updateUser)
user_route.get('/cancel-order',userMiddleware.isLogin,userControllers.cancelOrder)
user_route.get('/view-order',userMiddleware.isLogin,userControllers.viewOrder)

user_route.get('/order-success',userMiddleware.isLogin,userControllers.loadSuccess)

user_route.get('/dashboard',userMiddleware.isLogin,userControllers.userDashboard)
user_route.post('/addAddress',userMiddleware.isLogin,userControllers.addAddress)
user_route.get('/deleteAddress',userControllers.deleteAddress)



user_route.post('/razorpay',userMiddleware.isLogin,userControllers.razorpayCheckout)

user_route.get('/return-product',userControllers.returnProduct)


user_route.post('/add-coupon',userControllers.addCoupon)


user_route.get('/blog',userControllers.viewBlog)
user_route.get('/about',userControllers.viewAbout)
user_route.get('/contact',userControllers.viewContact)

user_route.post("/register", userControllers.insertUser)
user_route.post('/login', userControllers.varifyLogin);

user_route.get('/logout', userControllers.logout);



module.exports = user_route;