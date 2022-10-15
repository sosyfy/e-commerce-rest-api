const express = require("express")
const router = express.Router()
const { createCategory, updateCategory ,getAllCategories } = require("../controllers/categoryController")
const { isLoggedIn , customRole } = require("../middlewares/userInfo")


router.route('/category/create').post(isLoggedIn , customRole('admin'), createCategory )
router.route('/category/update').post(isLoggedIn , customRole('admin'), updateCategory )
router.route('/category/list').get(isLoggedIn , customRole('admin'), getAllCategories )


module.exports = router 