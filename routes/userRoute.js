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

router.route('/signup').post(signUp)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/user/info').get(isLoggedIn , LoggedInUserDetails)
router.route('/user/info/update').post(isLoggedIn , LoggedInUserDetailsUpdate)
router.route('/changePassword').post( isLoggedIn ,passwordUpdate)



router.route('/admin/users').get( isLoggedIn , customRole("admin"), adminAllUsers )


module.exports = router 