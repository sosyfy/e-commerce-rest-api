const  mongoose  = require("mongoose");

const subcategorySchema = new mongoose.Schema({

    name: {
        type: String ,
        required : [true , "Please provide a sub-category name"],
        trim:true ,
        maxLength: [130 , "sub-category name  should not be more than 130 characters"]
       },
    
    createdAt : {
        type : Date ,
        default: Date.now 
      }, 
})



module.exports = mongoose.model('SubCategory', subcategorySchema)