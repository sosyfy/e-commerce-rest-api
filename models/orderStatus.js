const  mongoose  = require("mongoose");

const orderStatusSchema = new mongoose.Schema({

    name: {
        type: String ,
        required : [true , "Please provide an order status name"],
        trim:true ,
        maxLength: [130 , "order status name should not be more than 130 characters"]
       }
},{timestamps: true })

orderStatusSchema.methods.toJSONFor = function(status){
    return {
        id: this._id,
        name: this.name,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
}

module.exports = mongoose.model('OrderStatus', orderStatusSchema)