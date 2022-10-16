const  mongoose  = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true 
      }
} , {timestamps: true})

brandSchema.methods.toJSONFor = function(brand){
    return {
        id: this._id,
        name: this.name,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
}



module.exports = mongoose.model('Brand', brandSchema )