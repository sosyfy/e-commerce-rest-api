const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const Product = require('../models/product')
const { ErrorResponse ,validationErrorWithData } = require('../utils/apiResponse')
const productJson = require('../utils/productJsonHelper')


//& Function to create a new product

exports.createProduct = BigPromise( async ( req , res , next )=>{
    try {

        //& set user value in the body and create product 
    
        req.body.user = req.user.id 
        let product = await Product.create(req.body)
        product = await productJson([product])
        //& send user the created product 
    
        res.status(201).json({
            success : true ,
            message: "created product",
            data: product 
        })


    }  catch (error) {
        validationErrorWithData(res, "An Error occured" , error.message )
       return next(new CustomError(404, false , "An Error occured"))
   }
})

//& Function to get all active products 

exports.allProducts = BigPromise( async ( req , res , next )=>{
     try{

         //& get pagination parameters 
     
         const { page = 1, size = 10 } = req.query;
     
         let products = await Product.find({active: true }).limit( Number(size) ).skip((page - 1 ) * size ).exec()
         products = await productJson(products)
          
         //& send user the products that are active 
         res.status(201).json({
             success : true ,
             message: "fetch success",
             data: products,
             page: Number(page),
             size: Number(size),
             totalProducts: products?.length
         })

     } catch (error) {
        validationErrorWithData(res, "An Error occured" , error.message )
       return next(new CustomError(404, false , "An Error occured"))
   }
})

//& Function to get all products in the store 

exports.allProductsAdmin = BigPromise( async ( req , res , next )=>{
   try {

       //& pagination parameters with defaults set 
   
       const { page = 1, size = 10 } = req.query;
       
       //& all products 
       let products = await Product.find().limit(Number(size)).skip((page - 1 ) * size )
       products = await productJson(products)
       //& all active products 
       let activeProducts = await Product.find({active: true })
       activeProducts = await productJson(activeProducts)
       //& all inactive products 
       let inactiveProducts = await Product.find({active: false })
       inactiveProducts = await productJson(inactiveProducts)
     
       
       //& send products list 
       res.status(201).json({
           success : true ,
           message: "fetch success",
           data: { products , activeProducts , inactiveProducts },
           page: Number(page),
           size: Number(size),
           totalProducts: products?.length
       })

   } catch (error) {
    validationErrorWithData(res, "An Error occured" , error.message )
   return next(new CustomError(404, false , "An Error occured"))
}
})

//& Function to get one product details 

exports.findOneProduct = BigPromise( async ( req , res , next )=>{
  try {

      //& Get product id and find it 
      const { id } = req.params;
      
      let product = await Product.findById(id)
      product = await productJson([product])
      
      //& get featured products
      let recommendedProducts = await Product.find({ subCategory: product.subCategory }).limit(10)
      recommendedProducts =  await  productJson(recommendedProducts) 
      //& get from same brand 
      let sameBrand = await Product.find({ brand : product.brand }).limit(10)
      sameBrand =  await  productJson(sameBrand) 
  
      //& send the user the product 
      res.status(201).json({
          success : true ,
          message: "fetch success",
          data: {
           product,
           recommendedProducts,
           sameBrand 
          }      
      })


  }  catch (error) {
    validationErrorWithData(res, "An Error occured" , error.message )
   return next(new CustomError(404, false , "An Error occured"))
}
})

//& Function to update  a product 

exports.updateOneProduct = BigPromise( async ( req , res , next )=>{
    try {

        //& get product and update if it exists 
    
        prodId = req.params.id 

        let product = await Product.findByIdAndUpdate( prodId , req.body, {
            new: true ,
            runValidators: true ,
            useFindAndModify: false 
        })
        .catch((err)=>{
            ErrorResponse(res , "Unable to upadate this Product", err.message )
            return next( new CustomError(404 , false , "Unable to upadate this Product"))
        })
    
      product = await productJson([product])
        
        //& send user the updated product details
    
    
        res.status(201).json({
            success : true ,
            message: "update success",
            data: product 
        })

    }  catch (error) {
        validationErrorWithData(res, "An Error occured" , error.message )
       return next(new CustomError(404, false , "An Error occured"))
   }
})

//& Function to deactive product 

exports.toggleProductStatus = BigPromise( async ( req , res , next )=>{
    try {
        //& get product and update active key property if it exists 
        prodId = req.body.id 
        
       let product = await Product.findByIdAndUpdate( prodId , { active : req.body.active }, {
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

    }  catch (error) {
        validationErrorWithData(res, "An Error occured" , error.message )
       return next(new CustomError(404, false , "An Error occured"))
   }
})

//& Function to delete product 

exports.deleteOneProduct = BigPromise( async ( req , res , next )=>{
  try {
    
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

  }  catch (error) {
    validationErrorWithData(res, "An Error occured" , error.message )
   return next(new CustomError(404, false , "An Error occured"))
}
})

//& Function to add a review to a product 

exports.addReview = BigPromise( async ( req , res , next )=>{
 try {

     const { rating ,comment , productId } = req.body 
     //& Craft a mock review schema 
 
     const review = {
         user: req.user._id,
         author: req.user.firstName + " " + req.user.lastName,
         rating: Number(rating),
         comment: comment
     }
     
     //& find the product to review 
 
     let product = await Product.findById( productId )
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

 }  catch (error) {
    validationErrorWithData(res, "An Error occured" , error.message )
   return next(new CustomError(404, false , "An Error occured"))
}

})

//& Function to get  all reviews in a product 

exports.allReviews = BigPromise( async ( req , res , next )=>{
 try {

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

 } catch (error) {
    validationErrorWithData(res, "An Error occured" , error.message )
   return next(new CustomError(404, false , "An Error occured"))
}
})

