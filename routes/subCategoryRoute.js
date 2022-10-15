const express = require("express")
const router = express.Router()
const { createSubCategory, updateSubCategory ,getAllSubCategories } = require("../controllers/subCategoryController")
const { isLoggedIn , customRole } = require("../middlewares/userInfo")


router.route('/sub-category/create').post(isLoggedIn , customRole('admin'), createSubCategory )
router.route('/sub-category/update').post(isLoggedIn , customRole('admin'), updateSubCategory )
router.route('/sub-category/list').get(isLoggedIn , customRole('admin'), getAllSubCategories )


module.exports = router 