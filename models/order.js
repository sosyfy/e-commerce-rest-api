const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    postalcode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  orderItems: [
    { 
        name: {
            type: String,
            required: true 
        },
        quantity: {
            type: String,
            required: true 
        },
        price: {
            type: String,
            required: true 
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: false 
        }
    }
   ],

  paymentInfo: {
    id: {
        type: String
    }
  },

  taxAmount:{
    type: Number ,
    required: true 
  },


  totalAmount:{
    type: Number ,
    required: true 
  },

  shippingAmount:{
    type: Number ,
    required: true 
  },

  orderStatusId:{
    type: mongoose.Schema.ObjectId,
    required: true,
    default: "processing"
  },

  deliveredAt : {
    type: Date 
  },
  
   createdAt:{
    type: Date,
    default: Date.now
   }

});

module.exports = mongoose.model("Order", orderSchema);
