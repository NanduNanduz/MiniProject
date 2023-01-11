const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file,cb){
        if(file.filename !== 'image'){
            cb(null,"./public/assets/uploads/")
        }else{
            cb(null,'public/uploadimages')
        }
        },
        filename: function(req, file, cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9)
            cb(null,file.filename + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })


    exports.upload = multer({ storage})