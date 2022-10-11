const mongoose = require('mongoose')
const validator = require('validator')


const productSchema = new mongoose.Schema({
   name: {
    type: String ,
    required : [true , "Please provide a product name"],
    trim:true ,
    maxLength: [130 , "product should not be more than 130 characters"]
   },

   description : {
    type: String ,
    required : [true , "Please provide a product description"],
   },

   price : {
    type: Number,
    required : [true , "Please provide a product price"],
   },

   category : {
    type: String ,
    required : [true , "Please provide a product category"],
   },

   
   brand : {
    type: String ,
    required : [true , "Please provide a product brand"],
   },

   photos: [
    {
        id: {
            type: String,
            // required:true 
        },
        secure_url:{
            type: String,
            // required: true 
        }
    }
   ],


   rating : {
    type: Number ,
    default : 0,
   },

   numberOfReviews : {
    type: Number ,
    default : 0,
   },
   

   reviews : [ 
     {
        user : {
            type : mongoose.Schema.ObjectId,
            ref: "User",
            required: true 
        },
        name: {
            type: String,
            required : true 
        },
        comment: {
            type: String,
        },
        rating : {
            type: Number,
            required : true 
        },
     }
   ],

   user: {
     type : mongoose.Schema.ObjectId,
     ref: 'User',
     required: true 
   },

   createdAt : {
     type : Date ,
     default: Date.now 
   },

   inStock: {
       type: Number,
       required: true 
   },

   active: {
     type: Boolean,
     default: true
   }
    
})


module.exports = mongoose.model('Product', productSchema )
