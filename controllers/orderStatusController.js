const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const OrderStatus = require('../models/orderStatus')

exports.createOrderStatus = BigPromise( async(req ,res ,next)=>{
   const { name } = req.body 

   if (!name) {
    validationErrorWithData(res, "Order Status name cannot be null")
    return next(new  CustomError(404, false , "Order Status name cannoot be null"))
   }

   if( await OrderStatus.findOne({name : name })){
    validationErrorWithData(res, "Order Status already exists")
    return next(new CustomError(404, false , "Order Status name cannot be null"))
   }

   const orderStatus  = await OrderStatus.create({name})


   res.status(200).json({
    status: true,
    message : "success",
    data: orderStatus
   })

})

exports.updateOrderStatus = BigPromise( async(req ,res ,next)=>{
    const { id,  name } = req.body 
   if (!name || !id ) {
    validationErrorWithData(res, "Order Status name cannot be null")
    return next(new  CustomError(404, false , "Order Status name cannot be null"))
   }

  await OrderStatus.findByIdAndUpdate( id ,{ name : name})

   res.status(200).json({
    status: true,
    message : "success",
   })

})


exports.getAllOrderStatus = BigPromise( async(req ,res ,next)=>{
  

   const orderStatus  = await OrderStatus.find()


   res.status(200).json({
    status: true,
    message : "success",
    data: orderStatus 
   })

})

