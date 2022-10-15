const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const Product = require('../models/product')
const { ErrorResponse } = require('../utils/apiResponse')


//& Function to create a new product

exports.createProduct = BigPromise( async ( req , res , next )=>{
    
    //& set user value in the body and create product 

    req.body.user = req.user.id 
    const product = await Product.create(req.body)

    //& send user the created product 

    res.status(201).json({
        success : true ,
        product,
        message: "created product "
    })
})

//& Function to get all active products 

exports.allProducts = BigPromise( async ( req , res , next )=>{

    //& get pagination parameters 

    const { page = 1, size = 10 } = req.query;

    const products = await Product.find({active: true }).limit( Number(size) ).skip((page - 1 ) * size ).exec()

     
    //& send user the products that are active 
    res.status(201).json({
        success : true ,
        message: "fetch success",
        data: products,
        page: Number(page),
        size: Number(size),
        totalProducts: products?.length
    })
})

//& Function to get all products in the store 

exports.allProductsAdmin = BigPromise( async ( req , res , next )=>{

    //& pagination parameters with defaults set 

    const { page = 1, size = 10 } = req.query;
    
    //& all products 
    const products = await Product.find().limit(Number(size)).skip((page - 1 ) * size )
    //& all active products 
    const activeProducts = await Product.find({active: true })
    //& all inactive products 
    const inactiveProducts = await Product.find({active: false })
     
    
    //& send products list 
    res.status(201).json({
        success : true ,
        message: "fetch success",
        data: { products , activeProducts , inactiveProducts },
        page: Number(page),
        size: Number(size),
        totalProducts: products?.length
    })
})

//& Function to get one product details 

exports.findOneProduct = BigPromise( async ( req , res , next )=>{

    //& Get product id and find it 
    const { id } = req.params;
    
    const product = await Product.findById(id)

    .catch(()=>{
        ErrorResponse(res , "Could not find product by Id")
        return next( new CustomError(404 , false , "could not find product "))
    })
    
    //& get featured products
    const recommendedProducts = await Product.find({ subCategory: product.subCategory }).limit(10)

    //& get from same brand 
    const sameBrand = await Product.find({ brand : product.brand }).limit(10)

    //& send the user the product 
    res.status(201).json({
        success : true ,
        message: "fetch success",
        data: {
         product ,
         recommendedProducts,
         sameBrand 
        }
            
    })
})

//& Function to update  a product 

exports.updateOneProduct = BigPromise( async ( req , res , next )=>{
    
    //& get product and update if it exists 

    prodId = req.params.id 
    const product = await Product.findByIdAndUpdate( prodId , req.body, {
        new: true ,
        runValidators: true ,
        useFindAndModify: false 
    })
    .catch((err)=>{
        ErrorResponse(res , "Unable to upadate this Product", err.message )
        return next( new CustomError(404 , false , "Unable to upadate this Product"))
    })
    
  
    //& send user the updated product details 

    res.status(201).json({
        success : true ,
        message: "update success",
        data: product
    })
})

//& Function to deactive product 

exports.toggleProductStatus = BigPromise( async ( req , res , next )=>{
    
    //& get product and update active key property if it exists 
    prodId = req.body.id 
    
    const product = await Product.findByIdAndUpdate( prodId , { active : req.body.active }, {
        new: true ,
        runValidators: true ,
        useFindAndModify: false 
    })
    .catch((err)=>{
        ErrorResponse(res , "Unable to upadate this Product", err.message )
        return next( new CustomError(404 , false , "Unable to upadate this Product"))
    })
    
  
    //& send user the updated product details 
    res.status(201).json({
        success : true ,
        message: "update success",
        data: product
    })
})

//& Function to delete product 

exports.deleteOneProduct = BigPromise( async ( req , res , next )=>{

    prodId = req.body.id 

    //& get product if it exists 

    const product = await Product.findById( prodId)
    .catch((err)=>{
        ErrorResponse(res , "Unable to find this Product", err.message )
        return next( new CustomError(404 , false , "Unable to find this Product"))
    })
    
    //& delete product if it exists

     await product.remove()
     
     .catch((err)=>{
        ErrorResponse(res , "Unable to delete this Product", err.message )
        return next( new CustomError(404 , false , "Unable to delete this Product"))
    })
    
    //& send succes message 

    res.status(200).json({
        success : true ,
        message: "delete success",
    })
})

//& Function to add a review to a product 

exports.addReview = BigPromise( async ( req , res , next )=>{

    const { rating ,comment , productId } = req.body 
    //& Craft a mock review schema 

    const review = {
        user: req.user._id,
        author: req.user.firstName + " " + req.user.lastName,
        rating: Number(rating),
        comment: comment
    }
    
    //& find the product to review 

    const product = await Product.findById( productId )

    .catch((err)=>{
        ErrorResponse(res , "Unable to find this Product", err.message )
        return next( new CustomError(404 , false , "Unable to find this Product"))
    })
    
    //& Case 1 : if product  is already reviewed by user update the review with new details 
    const AlreadyReviewed = product.reviews.find(
         ( rev )=> rev.user.toString() === req.user._id.toString()
    )

    if ( AlreadyReviewed ) {
         product.reviews.forEach((rev)=> {
            if (rev.user.toString() === req.user._id.toString()) {
              rev.comment = comment 
              rev.rating = rating 
            }
         })
 
    //& Case 2 : if product  has no review make a new review and update number of reviewws 
    
    } else {
       await  product.reviews.push(review) 
       product.numberOfReviews  =  product.reviews?.length 
    }

    //& update the rating from new details 

    product.rating = product.reviews.reduce((acc ,item ) => item.rating + acc )

    //& save all details 
    
    await product.save({validateBeforeSave: false })

    //& send user the product review 

    res.status(200).json({
        success : true ,
        message: "review added",
        data: product
    })
})

//& Function to get  all reviews in a product 

exports.allReviews = BigPromise( async ( req , res , next )=>{

    const productId  = req.params.id
    //& get product id and find it from db 

    const product = await Product.findById( productId )
    .catch((err)=>{
        ErrorResponse(res , "Unable to find this Product", err.message )
        return next( new CustomError(404 , false , "Unable to find this Product"))
    })
    
    //& send success with all reviews 
    
    res.status(200).json({
        success : true ,
        message: "reviews fetchd",
        data: {
            reviews : product.reviews,
            rating : product.rating,
            totalReviews: product.numberOfReviews
        }
    })
})

