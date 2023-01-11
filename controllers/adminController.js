const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const Product = require('../models/productsModel')
const Order = require('../models/ordersModel');
const Category = require('../models/categoryModel');
const { find } = require('../models/productsModel');
const Banner = require('../models/bannerModel');
const Offer = require('../models/offerModel')




let isAdminLoggedin
isAdminLoggedin = false
//  let adminSession = false || {}
let orderType = 'all'


// const path = require("path");
// const multer = require("multer");
// let Storage = multer.diskStorage({
//     destination: "./public/assets/uploads/",
//     filename: (req, file, cb) => {
//         cb(
//             null,
//             file.fieldname+ "_" + Date.now() + path.extname(file.originalname)
//         );
//     },
// });

// let upload = multer({
//     storage: Storage,
// }).single("image");


const loadLogin = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId

        res.render('login')
    } catch (error) {
        console.log("error")
    }
}


const loadHome = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId

        res.render('home')
    } catch (error) {
        console.log("error")
    }
}


const verifyLogin = async (req, res) => {
    try {
        console.log("admin in")

        const email = req.body.email;
        const password = req.body.password;
        console.log(email)
        console.log(password)
        const userData = await User.findOne({ email: email })
        if (userData) {
            if (password == userData.password) {
                console.log(userData.password)
                if (userData.is_admin == 0) {
                    res.render('login', { message: "email and password incorrect" });
                }
                else {
                    console.log("pwd matched")
                    //ith rahul mmattiyath
                    const adminSession = req.session;
                    adminSession.adminId = userData._id
                    console.log(adminSession.adminId)
                    res.render("home");
                }
            } else {
                res.render('login', { message: "email and password is incorrect" });
            }
        }
        else {
            res.render('login', { message: "email and password is incorrect" });
        }
    } catch (error) {
        console.log(error);
    }
}



const adminUser = async (req, res) => {
    try {

        const adminSession = req.session;
        adminSession.adminId
        const userData = await User.find({ is_admin: 0 })

        res.render('userList', { users: userData });
    }
    catch (error) {
        console.log("dashboard error")
    }
}



const allProducts = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId
        const productData = await Product.find()
        res.render('adminProductlist', { product: productData })
    } catch (error) {
        console.log(error.message)
    }
}

// const viewProduct = async (req, res) => {
//     const adminSession = req.session;
//     adminSession.adminId
//     const productData = await Product.find()
//     res.render('adminProductlist', { product: productData })
// };


const addProduct = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId
        const categoryData = await Category.find()
        res.render('addProduct', { category: categoryData })
        console.log('add product in')

    } catch (error) {
        console.log(error.message)
    }
}



const updateAddProduct = async (req, res) => {
    try {
        console.log(req.body.name)
        const product = Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            image : req.files[0] && req.files[0].filename ? req.files[0].filename:"",
           image1 : req.files[1] && req.files[1].filename ? req.files[1].filename:"",
           image2 : req.files[2] && req.files[2].filename ? req.files[2].filename:"",
        });
        console.log(product)
        const productData = await product.save();
        console.log("product data entered")
        console.log(productData);
        if (productData) {
            console.log("products added")
            res.redirect("/admin/productlist")
        } else {
            res.render("addProduct", { message: "Your registration was a failure" });
        }
    } catch (error) {
        console.log(error.message);
    }
};


const editProduct = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await Product.findById({ _id: id })
        if (productData) {
            res.render('edit-products', { product: productData })
        } else {
            res.redirect('/admin/viewProduct')
        }
    } catch (error) {
        console.log(error.message);
    }
}






const updateEditproduct = async (req, res) => {
    try {
        console.log(req.body.id)
        const productDat = await Product.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
               
                image :"",
                image1 :"",
                image2 :"",
            }
        })
    
        const productData = await Product.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                category: req.body.category,
                image : req.body.image[0],
                image1 : req.body.image[1],
                image2 : req.body.image[2],
            }
        })
        res.redirect('/admin/viewProduct')
    } catch (error) {
        console.log(error.message)
    }
}



const deleteProduct = async (req, res) => {
    try {
        const id = req.query.id;
        await Product.deleteOne({ _id: id })
        res.redirect('/admin/productlist')
    } catch (error) {
        console.log("delete product")
    }
}



// const block = async(req,res)=>{
//     try {
//         const id = req.query.id
//         const userData = await User.findById({ _id:id })
//     if(userData.isVerified){
//         await User.findByIdAndUpdate({_id:id},{ $set:{isVerified:0} })
//     }
//     else{
//         await User.findByIdAndUpdate({_id:id},{ $set:{isVerified:1} })  
//     }
//         res.redirect('/admin/view-user')

//     } catch (error) {
//         console.log(error.message);
//     }
// }


const block = async (req, res) => {
    console.log("blocking ")
    try {
        const id = req.query.id
        console.log(id)
        const userData = await User.findById({ _id: id })
        console.log(userData)
        if (userData.is_blocked) {
            console.log("unblocking")
            await User.findByIdAndUpdate({ _id: id }, { $set: { is_blocked: 0 } })
            res.redirect('/admin/dashboard')
        }
        else {
            await User.findByIdAndUpdate({ _id: id }, { $set: { is_blocked: 1 } })
            res.redirect('/admin/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }
}


const viewCategory = async (req, res) => {
    const adminSession = req.session;
    adminSession.adminId
    const categoryData = await Category.find()
    res.render('category', { category: categoryData })
}


const loadCategory = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId
        res.render('addCategory')
    } catch (error) {
        console.log(error.message)
    }
}


const addCategory = async (req, res) => {
    const category = Category({
        name: req.body.category
    })
    console.log(category)
    const categoryData = await category.save()
    res.redirect('/admin/category')
}


const deleteCategory = async (req, res) => {
    try {
        const id = req.query.id
        await Category.deleteOne({ _id: id })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);
    }
}


const editCategory = async (req, res) => {
    try {
        const id = req.query.id
        const categoryData = await Category.findById({ _id: id })
        if (categoryData) {
            res.render('editCategory', { category: categoryData })
        } else {
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const updateEditcategory = async (req, res) => {
    try {
        console.log(req.body.id)
        const categoryData = await Category.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                name: req.body.name
            }
        })
        res.render('category');
    } catch (error) {
        console.log(error.message)
    }
}




const loadBanners = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId
        console.log(adminSession.adminId)
        console.log("entered banner")
        const bannerData = await Banner.find()
        console.log(bannerData);
        res.render('banners', { banners: bannerData })
    } catch (error) {
        console.log(error.message)
    }
}


const addBanner = async(req,res)=>{
    try {
      const newBanner = req.body.banner
      console.log(newBanner);
      const a = req.files
      console.log(req.files)
      const banner = new Banner({
        banner:newBanner,
        bannerImage:a.map((x)=>x.filename)
      })
      const bannerData = await banner.save()
      if(bannerData){
        res.redirect('/admin/loadBanners')
      }
  
    } catch (error) {
      console.log(error.message)
    }
  }




const currentBanner = async (req, res) => {
    try {
        const adminSession = req.session;
        adminSession.adminId
        const id = req.query.id
        await Banner.findOneAndUpdate({ is_active: 1 }, { $set: { is_active: 0 } })
        await Banner.findByIdAndUpdate({ _id: id }, { $set: { is_active: 1 } })
        res.redirect('/admin/loadBanners')
    } catch (error) {
        console.log(error.message)
    }
}




  








const logout = async (req, res) => {
    console.log("logout")
    try {
        
        adminSession = req.session
        adminSession.adminId = false
        isLoggedin = false
        console.log(isLoggedin)
        res.redirect('/admin')
        console.log("userloggedout")
    } catch (error) {
        console.log(error)
    }
}

// const viewOrder = async(req,res)=>{
//     try{
//         const orderData = await Order.find()
//         if(orderType == undefined){
//             res.render('adminOrder', {order:orderData})
//         } else{
//             id = req.query.id
//             res.render('adminOrder',{id:id,order:orderData})
//         }
//     }catch(error){
//         console.log(error)
//     }
// };




const viewOrder = async (req, res) => {
    try {
        const productData = await Product.find();
        const userData = await User.find({ is_admin: 0 });
        console.log(userData)
        const orderData = await Order.find().sort({ createdAt: -1 });
        for(let key of orderData){
          
          await key.populate('products.item.productId');
          await key.populate('userId');
        }
        console.log(orderData);
        if (orderType == undefined) {
          res.render('adminOrder', {
            users: userData,
            product: productData,
            order: orderData,
          });
        } else {
          id = req.query.id;
  
          res.render('adminOrder', {
            users: userData,
            product: productData,
            order: orderData,
            id: id,
          });
        }
    } catch (error) {
      console.log(error.message);
    }
  };






const adminCancelOrder = async(req,res)=>{
    const id = req.query.id
    await Order.deleteOne({ _id:id })
    res.redirect('/admin/adminOrder')
};



const adminDeliveredorder = async(req,res)=>{
    const id = req.query.id
    await Order.updateOne({_id:id},{$set:{'status':'Delivered'}})
    res.redirect('/admin/adminOrder')
}


const adminConfirmorder = async(req,res)=>{
    const id = req.query.id
    await Order.updateOne({_id:id},{$set:{status:'Confirmed'}})
    res.redirect('/admin/adminOrder')
}




const adminLoadOffer = async(req,res)=>{
    const offerData = await Offer.find()
    res.render('admin-offer',{offer:offerData})
}

const adminStoreOffer = async(req,res)=>{
    const offer =Offer({
        name:req.body.name,
        type:req.body.type,
        discount:req.body.discount
    })
    await offer.save()
    res.redirect('/admin/admin-offer')
}

const deleteOffer = async (req, res, next) => {
    console.log("offer deleted")
    try {

        const id = req.query.id
       const offer= await Offer.findByIdAndDelete({ _id:id })

        res.redirect('/admin/admin-offer')
    } catch (error) {
        console.log(error)
    }
}




// const block = async (req, res) => {
//     console.log("query of block"+req.query.id)
//     try {
//         console.log(req.query.id)
//         const data = await User.findByIdAndUpdate({ _id:req.query.id },{$set:{is_blocked:1} })
//         console.log(data)
//         res.redirect("/admin/dashboard")
//     } catch (error) {
//         console.log("error blocking")
//     }
// }

// const unblock = async (req, res) => {
//     try {
//         const userData = await User.findByIdAndUpdate({ _id: req.query.id }, { $set: { is_blocked: 0 } })
//         res.redirect("/admin/dashboard")
//     } catch (error) {
//         console.log("error")
//     }
// }




module.exports = {
    loadLogin,
    loadHome,
    adminUser,
    verifyLogin,
    allProducts,
    addProduct,
    updateAddProduct,
    editProduct,
    // viewProduct,
    updateEditproduct,
    deleteProduct,
    block,
    viewCategory,
    addCategory,
    loadCategory,
    deleteCategory,
    editCategory,
    updateEditcategory,
    loadBanners,
    addBanner,
    currentBanner,
    viewOrder,
    adminCancelOrder,
    adminDeliveredorder,
    adminConfirmorder,
    adminLoadOffer,
    adminStoreOffer,
    deleteOffer,
    logout


    // unblock

}
