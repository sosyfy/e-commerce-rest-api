const  mongoose  = require("mongoose");

const categorySchema = new mongoose.Schema({

name: {
        type: String ,
        required : [true , "Please provide a category name"],
        maxLength: [130 , "category name  should not be more than 130 characters"]
       }
}, {timestamps : true })

categorySchema.methods.toJSONFor = function(category){
    return {
        id: this._id,
        name: this.name,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
}

module.exports = mongoose.model('Category', categorySchema)