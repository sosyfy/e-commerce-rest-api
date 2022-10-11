const express = require("express")
const router = express.Router()
const { isLoggedIn , customRole } = require("../middlewares/userInfo")
const { createProduct , allProducts, findOneProduct,allReviews,  updateOneProduct, toggleProductStatus, allProductsAdmin ,deleteOneProduct, addReview } = require("../controllers/productsController")


router.route('/product/create').post( isLoggedIn , customRole('admin') ,createProduct)
router.route('/product/list').get( allProducts)
router.route('/product/list/:id').get( findOneProduct)
router.route('/product/add/review').post(isLoggedIn , addReview)
router.route('/product/reviews/:id').get(allReviews)
router.route('/product/update/:id').post(isLoggedIn , customRole('admin') , updateOneProduct)
router.route('/product/toggleStatus').post(isLoggedIn , customRole('admin') , toggleProductStatus)
router.route('/products/admin').get( isLoggedIn , customRole('admin') , allProductsAdmin)
router.route('/product/delete').post( isLoggedIn , customRole('admin') , deleteOneProduct)


module.exports = router 