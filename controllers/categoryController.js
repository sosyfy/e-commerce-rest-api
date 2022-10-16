const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const Category = require('../models/category')

exports.createCategory = BigPromise( async(req ,res ,next)=>{
   try {

      const { name } = req.body 
   
      if (!name) {
       validationErrorWithData(res, "Category name cannot be null")
       return next(new  CustomError(404, false , "Category name cannoot be null"))
      }
   
      if( await Category.exists({name : name })){
       validationErrorWithData(res, "Category already exists")
       return next(new CustomError(404, false , "Category name cannot be null"))
      }
   
      const category  = await Category.create({name})
   
   
      res.status(200).json({
       status: true,
       message : "success",
       data: category.toJSONFor()
      })

   }  catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }

})

exports.updateCategory = BigPromise( async(req ,res ,next)=>{
   try {

     const { id,  name } = req.body 
     if (!name || !id ) {
      validationErrorWithData(res, "Category name cannot be null")
      return next(new  CustomError(404, false , "Category name cannot be null"))
     }
     
     
   if(! await Category.exists({ _id : id }) ){
      validationErrorWithData(res, "Category doesn't exists")
      return next(new CustomError(404, false , "Category doesnt exist "))
     }

   if( await Category.findOne({ name: name }) ){
      validationErrorWithData(res, "Category already exists")
      return next(new CustomError(404, false , "Category already exist "))
     }

     await Category.findByIdAndUpdate( id,{ name : name})
  
     res.status(200).json({
      status: true,
      message : "success",
     })

   }  catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }

})


exports.getAllCategories = BigPromise( async(req ,res ,next)=>{
  try {

     let categories  = await Category.find()
     
     categories =  categories.map((category)=>{
      return category.toJSONFor()
     })
   
    const categoryCount = await Category.countDocuments()
   
      res.status(200).json({
       status: true,
       message : "success",
       data:{ categories , categoryCount } 
      })

  }  catch (error) {
   validationErrorWithData(res, "An Error occured" , error.message )
  return next(new CustomError(404, false , "An Error occured"))
}


})

