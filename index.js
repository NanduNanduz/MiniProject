const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/minipjct_Database")

const nocache = require('nocache')




const User = require('./models/userModel')
const Product = require('./models/productsModel')




const express = require("express")
const app = express()
app.use(nocache())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const session = require('express-session')
const config = require('./config/config')
app.use(session({secret:config.sessionSecret}))


const userRoute = require('./routes/userRoute')
app.use('/', userRoute)


const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute)


app.listen(3000, function () {
    console.log("server is running")
})

