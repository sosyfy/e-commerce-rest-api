const express = require("express")
const router = express.Router()
const { isLoggedIn , customRole } = require("../middlewares/userInfo")
const { createProduct , allProducts, findOneProduct,allReviews,  updateOneProduct, toggleProductStatus, allProductsAdmin ,deleteOneProduct, addReview } = require("../controllers/productsController")

//& not logged in routes 
router.route('/product/list').get( allProducts)  //& all active products 
router.route('/product/list/:id').get( findOneProduct) //& view product
router.route('/product/reviews/:id').get(allReviews ) //& product reviews 

//& accessible only when logged in 
router.route('/product/add/review').post(isLoggedIn , addReview) //& create review or update it 


//& Admin only routes 
router.route('/product/create').post( isLoggedIn , customRole('admin') ,createProduct) //& create product
router.route('/product/update/:id').post(isLoggedIn , customRole('admin') , updateOneProduct)  //& update product
router.route('/product/toggleStatus').post(isLoggedIn , customRole('admin') , toggleProductStatus) //& deactivate / activate  product
router.route('/products/admin').get( isLoggedIn , customRole('admin') , allProductsAdmin) //& get all products  ( active / inactive )
router.route('/product/delete').post( isLoggedIn , customRole('admin') , deleteOneProduct) //& delete product


module.exports = router 