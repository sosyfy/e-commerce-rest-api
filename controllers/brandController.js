const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const Brand = require('../models/brand')

exports.createBrand = BigPromise( async(req ,res ,next)=>{
   try {
      
      const { name } = req.body 
      if (!name) {
       validationErrorWithData(res, "Brand name cannot be null")
       return next(new  CustomError(404, false , "Brand name cannot be null"))
      }
   
      if( await Brand.findOne({name : name })){
       validationErrorWithData(res, "Brand already exists")
       return next(new CustomError(404, false , "Brand name cannot be null"))
      }
   
      const brand  = await Brand.create({name})
   
   
      res.status(200).json({
       status: true,
       message : "success",
       data: brand
      })


   }  catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }

})

exports.updateBrand = BigPromise( async(req ,res ,next)=>{
   try {

   const { id,  name } = req.body 
   if (!name || !id ) {
    validationErrorWithData(res, "Brand name cannot be null")
    return next(new  CustomError(404, false , "Brand name cannoot be null"))
   }
   
      if( await Brand.findOne({name : name })){
         validationErrorWithData(res, "Brand already exists")
         return next(new CustomError(404, false , "Brand name cannot be null"))
        }

   if( ! await Brand.exists({ _id : id }) ){
      validationErrorWithData(res, "Brand doesn't exists")
      return next(new CustomError(404, false , "Brand doesnt exist "))
     }

   await Brand.findByIdAndUpdate(id ,{ name : name})

   res.status(200).json({
    status: true,
    message : "success",
   }) 

   } catch (error) {
       validationErrorWithData(res, "Brand doesn't exists" , error.message )
      return next(new CustomError(404, false , "Brand doesnt exist "))
   }
  

})


exports.getAllBrands = BigPromise( async(req ,res ,next)=>{

  try {
   
     let brands  = await Brand.find()
     const brandsCount = await Brand.countDocuments()
   
     brands = brands.map(function(brand){
         return brand.toJSONFor()
       })
   
      res.status(200).json({
       status: true,
       message : "success",
       data: { brands , brandsCount }
      })

  } 
   catch (error) {
       validationErrorWithData(res, "An Error occured" , error.message )
      return next(new CustomError(404, false , "An Error occured"))
  }

})

