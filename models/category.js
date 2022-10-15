const  mongoose  = require("mongoose");

const categorySchema = new mongoose.Schema({

    name: {
        type: String ,
        required : [true , "Please provide a category name"],
        maxLength: [130 , "category name  should not be more than 130 characters"]
       },
    
    createdAt : {
        type : Date ,
        default: Date.now 
      }, 
})



module.exports = mongoose.model('Category', categorySchema)