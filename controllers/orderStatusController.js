const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const { validationErrorWithData } = require('../utils/apiResponse')
const OrderStatus = require('../models/orderStatus')

exports.createOrderStatus = BigPromise( async(req ,res ,next)=>{
   try {
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
       data: orderStatus.toJSONFor()
      })

   } catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }

})

exports.updateOrderStatus = BigPromise( async(req ,res ,next)=>{
   try {
      const { id,  name } = req.body 
      if (!name || !id ) {
       validationErrorWithData(res, "Order Status name cannot be null")
       return next(new  CustomError(404, false , "Order Status name cannot be null"))
      }

      if( await OrderStatus.findOne({name : name })){
         validationErrorWithData(res, "OrderStatus already exists")
         return next(new CustomError(404, false , "OrderStatus name cannot be null"))
        }

      if( ! await OrderStatus.exists({ _id : id }) ){
         validationErrorWithData(res, "OrderStatus doesn't exists")
         return next(new CustomError(404, false , "OrderStatus doesnt exist "))
        }
   
   
   
     await OrderStatus.findByIdAndUpdate( id ,{ name : name})
   
      res.status(200).json({
       status: true,
       message : "success",
      })


   }  catch (error) {
      validationErrorWithData(res, "An Error occured" , error.message )
     return next(new CustomError(404, false , "An Error occured"))
 }

})


exports.getAllOrderStatus = BigPromise( async(req ,res ,next)=>{
  try {

     let orderStatus  = await OrderStatus.find()
    
     orderStatus =  orderStatus.map((status)=>{
      return status.toJSONFor()
     })
   
    const orderStatusCount = await OrderStatus.countDocuments()
   
      res.status(200).json({
       status: true,
       message : "success",
       data:{ orderStatus , orderStatusCount } 
      })

  } catch (error) {
   validationErrorWithData(res, "An Error occured" , error.message )
  return next(new CustomError(404, false , "An Error occured"))
}

})

