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

   summaryDescription : {
    type: String ,
   },

   price : {
    type: Number,
    required : [true , "Please provide a product price"],
   },

   dicountedPrice : {
    type: Number,
   },

   discountPercentage : {
    type: Number,
   },

   categoryId : {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required : [true  , "Please provide a product category"],
   },

   subCategoryId : {
    type: mongoose.Schema.ObjectId,
    ref: 'SubCategory',
    required : [true  , "Please provide a product category"],
   },

   
   brandId : {
    type: mongoose.Schema.Types.ObjectId ,
    ref: 'Brand',
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
        author : {
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

   
   inStock: {
     type: Number,
     required: true 
    },

   numberOfOrders: {
     type: Number,
     default: 0 
    },
    
    active: {
      type: Boolean,
      default: true
    },

    updatedBy : {
      type : String  
    },
    
},{timestamps: true})

productSchema.methods.toJSONFor = function(){
  return {
      id : this._id,
      name: this.name ,
      summaryDescription: this.summaryDescription || null,
      description: this.description || null,
      price: this.price,
      dicountedPrice: this.dicountedPrice || null,
      discountPercentage: this.discountPercentage || null,
      category: this.categoryId,
      subCategory: this.subCategoryId,
      brand: this.brandId,
      photos : this.photos,
      rating : this.rating,
      numberOfReviews: this.numberOfReviews,
      reviews: this.reviews,
      inStock: this.inStock,
      numberOfOrders: this.numberOfOrders,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy  
  }
}



module.exports = mongoose.model('Product', productSchema )
