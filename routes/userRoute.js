const express = require("express")
const router = express.Router()
const { 
    signUp, 
    login , 
    logout , 
    forgotPassword,
    passwordReset, 
    LoggedInUserDetails,
    passwordUpdate,
    LoggedInUserDetailsUpdate,
    adminAllUsers
 } = require('../controllers/userController')

const { isLoggedIn , customRole } = require("../middlewares/userInfo")

//& not logged in routes 
router.route('/signup').post(signUp) //& sign up to the application 
router.route('/login').post(login) //& login to application 
router.route('/forgotPassword').post(forgotPassword) //& forgot password email 
router.route('/password/reset/:token').post(passwordReset) //& reset password 

//& accessible only when logged in 
router.route('/logout').get( isLoggedIn ,logout) //& logout the application 
router.route('/user/info').get(isLoggedIn , LoggedInUserDetails) //& get personal details 
router.route('/user/info/update').post(isLoggedIn ,LoggedInUserDetailsUpdate) //& update personal details 
router.route('/changePassword').post( isLoggedIn ,passwordUpdate) //& upating password 

//& Admin only routes 
router.route('/admin/users').get( isLoggedIn , customRole("admin"), adminAllUsers ) //& get all users 


module.exports = router 