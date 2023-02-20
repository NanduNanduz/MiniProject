const express = require("express");
const admin_route = express();


const adminMiddleware = require('../middleware/adminMiddleware')
const Category = require('../models/categoryModel')


const path = require("path");
const multer = require('../util/multer');

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');


const adminController = require("../controllers/adminController");


// admin_route.get('/login',adminMiddleware.isLogout, adminController.loadLogin)
//  admin_route.get('/dashboard', adminMiddleware.isLogin, adminController.loadDashboard)

admin_route.get('/dashboard', adminMiddleware.isLogin, adminController.loadHome)


admin_route.get('/usersList', adminMiddleware.isLogin, adminController.adminUser)
admin_route.get('/productlist', adminController.allProducts)
admin_route.get('/addProduct',adminMiddleware.isLogin, adminController.addProduct)
admin_route.get('/edit-products', adminMiddleware.isLogin,adminController.editProduct)
// admin_route.get('/viewProduct',adminMiddleware.isLogin, adminController.viewProduct)
admin_route.get('/deleteProduct', adminMiddleware.isLogin, adminController.deleteProduct)

admin_route.get('/block', adminController.block)
// admin_route.get('/unblock', adminController.unblock)

admin_route.post('/addProduct', multer.upload.any(), adminController.updateAddProduct)
//  admin_route.post('/addProduct',adminController.upload, adminController.updateAddProduct)
// admin_route.post('/addProduct', adminController.updateAddProduct)
admin_route.post('/editproduct', multer.upload.any(), adminController.updateEditproduct)


admin_route.get('/category',adminMiddleware.isLogin, adminController.viewCategory)
admin_route.get('/addCategory',  adminMiddleware.isLogin,adminController.loadCategory)
admin_route.post('/addCategory', adminController.addCategory)
admin_route.get('/deleteCategory',adminMiddleware.isLogin, adminController.deleteCategory)
admin_route.get('/editCategory', adminController.editCategory)
admin_route.post('/editCategory', adminController.updateEditcategory)



admin_route.get('/loadBanners',adminMiddleware.isLogin,adminController.loadBanners)
admin_route.post('/loadBanners',multer.upload.array('bannerImage',3),adminController.addBanner)
admin_route.get('/currentBanner',adminMiddleware.isLogin,adminController.currentBanner)




admin_route.get('/adminOrder',adminMiddleware.isLogin,adminController.viewOrder)
admin_route.get('/admin-cancel-order',adminMiddleware.isLogin,adminController.adminCancelOrder)
admin_route.get('/admin-confirm-order',adminMiddleware.isLogin,adminController.adminConfirmorder)
admin_route.get('/admin-delivered-order',adminMiddleware.isLogin,adminController.adminDeliveredorder)






admin_route.get('/admin-offer',adminMiddleware.isLogin,adminController.adminLoadOffer)
admin_route.post('/admin-offer',adminMiddleware.isLogin,adminController.adminStoreOffer)
admin_route.get('/delete-offer',adminController.deleteOffer)



admin_route.get('/',adminMiddleware.isLogout, adminController.loadLogin)
admin_route.post('/', adminController.verifyLogin);
// admin_route.post('/login', adminController.verifyLogin);


admin_route.get('/chart', adminController.LoadChart)


admin_route.get('/logout',adminMiddleware.isLogin, adminController.logout)


module.exports = admin_route;


