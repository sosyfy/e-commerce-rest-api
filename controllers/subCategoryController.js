const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const SubCategory = require('../models/subcategory')

exports.createSubCategory = BigPromise( async(req ,res ,next)=>{
   try{

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
       data: subcategory.toJSONFor()
      })

   }  catch (error) {
       validationErrorWithData(res, "An Error occured" , error.message )
      return next(new CustomError(404, false , "An Error occured"))
  }

})

exports.updateSubCategory = BigPromise( async(req ,res ,next)=>{
   try {

      const { id,  name } = req.body 
     if (!name || !id ) {
      validationErrorWithData(res, "Sub Category name cannot be null")
      return next(new  CustomError(404, false , "Sub Category name cannot be null"))
     }
  
     if( await SubCategory.findOne({name : name })){
        validationErrorWithData(res, "Sub Category already exists")
        return next(new CustomError(404, false , "Sub Category already exists"))
     }
  
     if( !await SubCategory.findOne({ _id : id })){
        validationErrorWithData(res, "Sub Category doesnt exists")
        return next(new CustomError(404, false , "Sub Category doesn't exists"))
     }
  
  
    await SubCategory.findByIdAndUpdate( id ,{ name : name})
  
     res.status(200).json({
      status: true,
      message : "success",
     })

   }  catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }

})


exports.getAllSubCategories = BigPromise( async(req ,res ,next)=>{
   try {

      let subcategories  = await SubCategory.find()
     
      subcategories =  subcategories.map((category)=>{
      return category.toJSONFor()
     })
   
    const subcategoriesCount = await SubCategory.countDocuments()
   
      res.status(200).json({
       status: true,
       message : "success",
       data:{ subcategories , subcategoriesCount } 
      })

   } catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }
})

