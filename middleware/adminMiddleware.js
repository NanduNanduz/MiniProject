
let isAdminLoggedin = false
// let adminSession = false || {}

const isLogin = async (req, res, next) => {
    try {
        adminSession = req.session
        if (adminSession.adminId) {
            console.log("admin logged in")
            next()
        }
        else {
            console.log("logged out")
            res.redirect('/admin')
        }


    } catch (error) {
        console.log(error.message);
    }
}
const isLogout = async (req, res, next) => {
    try {
        adminSession = req.session
        if (adminSession.adminId) {
            res.redirect('/admin/dashboard')
        }
       
        next()

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}