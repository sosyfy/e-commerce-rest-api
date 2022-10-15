const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const Brand = require('../models/brand')

exports.createBrand = BigPromise( async(req ,res ,next)=>{
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

})

exports.updateBrand = BigPromise( async(req ,res ,next)=>{
    const { id,  name } = req.body 
   if (!name || !id ) {
    validationErrorWithData(res, "Brand name cannot be null")
    return next(new  CustomError(404, false , "Brand name cannoot be null"))
   }

   const brand  = await Brand.findByIdAndUpdate(id ,{ name : name})

   res.status(200).json({
    status: true,
    message : "success",
    // data: brand 
   })

})


exports.getAllBrands = BigPromise( async(req ,res ,next)=>{
  

   const brands  = await Brand.find()


   res.status(200).json({
    status: true,
    message : "success",
    data: brands 
   })

})

