const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const Category = require('../models/category')

exports.createCategory = BigPromise( async(req ,res ,next)=>{
   const { name } = req.body 

   if (!name) {
    validationErrorWithData(res, "Category name cannot be null")
    return next(new  CustomError(404, false , "Category name cannoot be null"))
   }

   if( await Category.findOne({name : name })){
    validationErrorWithData(res, "Category already exists")
    return next(new CustomError(404, false , "Category name cannot be null"))
   }

   const category  = await Category.create({name})


   res.status(200).json({
    status: true,
    message : "success",
    data: category
   })

})

exports.updateCategory = BigPromise( async(req ,res ,next)=>{
    const { id,  name } = req.body 
   if (!name || !id ) {
    validationErrorWithData(res, "Category name cannot be null")
    return next(new  CustomError(404, false , "Category name cannot be null"))
   }
   
   await Category.findByIdAndUpdate( id ,{ name : name})

   res.status(200).json({
    status: true,
    message : "success",
   })

})


exports.getAllCategories = BigPromise( async(req ,res ,next)=>{
  

   const categories  = await Category.find()


   res.status(200).json({
    status: true,
    message : "success",
    data: categories 
   })

})

