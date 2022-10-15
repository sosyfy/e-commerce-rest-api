const express = require("express")
const router = express.Router()
const { createBrand, updateBrand , getAllBrands } = require("../controllers/brandController")
const { isLoggedIn , customRole } = require("../middlewares/userInfo")



router.route('/brand/create').post(isLoggedIn , customRole('admin'), createBrand )
router.route('/brand/update').post(isLoggedIn , customRole('admin'), updateBrand )
router.route('/brand/list').get(isLoggedIn , customRole('admin'), getAllBrands )


module.exports = router 