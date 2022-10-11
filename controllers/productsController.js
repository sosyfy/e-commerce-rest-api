const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const Product = require('../models/product')
const { ErrorResponse } = require('../utils/apiResponse')



exports.createProduct = BigPromise( async ( req , res , next )=>{

    req.body.user = req.user.id 

    const product = await Product.create(req.body)

     
    
    res.status(201).json({
        success : true ,
        product,
        message: "created product "
    })
})

exports.allProducts = BigPromise( async ( req , res , next )=>{

    // req.body.user = req.user.id 

    const { page = 1, size = 10 } = req.query;
    
    const products = await Product.find({active: true }).limit(Number(size)).skip((page - 1 ) * size ).exec()

     
    
    res.status(201).json({
        success : true ,
        message: "fetch success",
        data: products,
        page: Number(page),
        size: Number(size),
        totalProducts: products?.length
    })
})

exports.allProductsAdmin = BigPromise( async ( req , res , next )=>{

    // req.body.user = req.user.id 

    const { page = 1, size = 10 } = req.query;
    
    const products = await Product.find().limit(Number(size)).skip((page - 1 ) * size )
    const activeProducts = await Product.find({active: true })
    const inactiveProducts = await Product.find({active: false })
     
    
    res.status(201).json({
        success : true ,
        message: "fetch success",
        data: { products , activeProducts , inactiveProducts },
        page: Number(page),
        size: Number(size),
        totalProducts: products?.length
    })
})


exports.findOneProduct = BigPromise( async ( req , res , next )=>{

    // req.body.user = req.user.id 

    const { id } = req.params;
    
    const products = await Product.findById(id)
    .catch(()=>{
        ErrorResponse(res , "could not find product by Id")
        return next( new CustomError(404 , false , "could not find product "))
    })
    
  
    
    res.status(201).json({
        success : true ,
        message: "fetch success",
        data: products
    })
})


exports.updateOneProduct = BigPromise( async ( req , res , next )=>{

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
    
  
    
    res.status(201).json({
        success : true ,
        message: "update success",
        data: product
    })
})

exports.toggleProductStatus = BigPromise( async ( req , res , next )=>{

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
    
  
    
    res.status(201).json({
        success : true ,
        message: "update success",
        data: product
    })
})


exports.deleteOneProduct = BigPromise( async ( req , res , next )=>{

    prodId = req.body.id 
    
    const product = await Product.findById( prodId)
    .catch((err)=>{
        ErrorResponse(res , "Unable to find this Product", err.message )
        return next( new CustomError(404 , false , "Unable to find this Product"))
    })
    
     await product.remove()
     .catch((err)=>{
        ErrorResponse(res , "Unable to delete this Product", err.message )
        return next( new CustomError(404 , false , "Unable to delete this Product"))
    })
    
    res.status(200).json({
        success : true ,
        message: "delete success",
    })
})


exports.addReview = BigPromise( async ( req , res , next )=>{

    const { rating ,comment , productId } = req.body 
    
    const review = {
        user: req.user._id,
        name: req.user.firstName,
        rating: Number(rating),
        comment: comment
    }
    
    const product = await Product.findById( productId )
    .catch((err)=>{
        ErrorResponse(res , "Unable to find this Product", err.message )
        return next( new CustomError(404 , false , "Unable to find this Product"))
    })
    
    const AlreadyReviewed = product.reviews.find(
         (rev)=> rev.user.toString() === req.user._id.toString()
    )

    if ( AlreadyReviewed ) {

         product.reviews.forEach((rev)=> {
            if (rev.user.toString() === req.user._id.toString()) {
              rev.comment = comment 
              rev.rating = rating 
            }
         })

    } else {
       await  product.reviews.push(review) 
       product.numberOfReviews  =  product.reviews?.length 
    }

    product.rating = product.reviews.reduce((acc ,item ) => item.rating + acc )

    await product.save({validateBeforeSave: false })

    res.status(200).json({
        success : true ,
        message: "review added",
    })
})


exports.allReviews = BigPromise( async ( req , res , next )=>{

    const productId  = req.params.id
    
    const product = await Product.findById( productId )
    .catch((err)=>{
        ErrorResponse(res , "Unable to find this Product", err.message )
        return next( new CustomError(404 , false , "Unable to find this Product"))
    })
    

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

