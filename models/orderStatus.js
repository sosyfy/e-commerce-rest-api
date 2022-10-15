const  mongoose  = require("mongoose");

const orderStatusSchema = new mongoose.Schema({

    name: {
        type: String ,
        required : [true , "Please provide an order status name"],
        trim:true ,
        maxLength: [130 , "order status name should not be more than 130 characters"]
       },
    
    createdAt : {
        type : Date ,
        default: Date.now 
      }, 
})



module.exports = mongoose.model('OrderStatus', orderStatusSchema)