const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const SubCategory = require('../models/subcategory')

exports.createSubCategory = BigPromise( async(req ,res ,next)=>{
   const { name } = req.body 

   if (!name) {
    validationErrorWithData(res, "Sub Category name cannot be null")
    return next(new  CustomError(404, false , "Sub Category name cannoot be null"))
   }

   if( await SubCategory.findOne({name : name })){
    validationErrorWithData(res, "Sub Category already exists")
    return next(new CustomError(404, false , "Sub Category name cannot be null"))
   }

   const subcategory  = await SubCategory.create({name})


   res.status(200).json({
    status: true,
    message : "success",
    data: subcategory
   })

})

exports.updateSubCategory = BigPromise( async(req ,res ,next)=>{
    const { id,  name } = req.body 
   if (!name || !id ) {
    validationErrorWithData(res, "Sub Category name cannot be null")
    return next(new  CustomError(404, false , "Sub Category name cannot be null"))
   }

  await SubCategory.findByIdAndUpdate( id ,{ name : name})

   res.status(200).json({
    status: true,
    message : "success",
   })

})


exports.getAllSubCategories = BigPromise( async(req ,res ,next)=>{
  

   const subcategories  = await SubCategory.find()


   res.status(200).json({
    status: true,
    message : "success",
    data: subcategories 
   })

})

