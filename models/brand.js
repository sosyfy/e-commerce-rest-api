const  mongoose  = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true 
      },
    
    createdAt : {
        type : Date ,
        default: Date.now 
      } 
})



module.exports = mongoose.model('Brand', brandSchema )