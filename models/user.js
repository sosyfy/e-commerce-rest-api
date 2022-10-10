const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
      firstName: {
        type: String,
        required: [true, "Please provide a  first name"],
      },
      lastName: {
        type: String,
        required: [true, "Please provide a last name"],
      },
      email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: [ validator.isEmail , "please enter a valid email"],
        unique: true 
      },
      password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6 , "password should be atleast 6 char "],
        select: false 
      },
      role: {
        type: String, 
        default: "User"
      },
      photo: {
        id: { 
            type: String,
        }, 
        
        secure_url: { 
            type: String,
        }, 
        
      },
      forgotPasswordToken: {
        type: String 
      },
      forgotPasswordExpiry: {
        type: Date
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

// encrypt password before save 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 10 )
})

// vaidate the password with user password 

userSchema.methods.isValidatedPassword = async function(sentPassword){
  return  await  bcrypt.compare( sentPassword, this.password )
}

// create and return jwt 
userSchema.methods.getJwtToken = function(){
   return    jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    {expiresIn:  process.env.JWT_EXPIRY}
   )
}

// generate forgot password token 

userSchema.methods.getForgetPasswordToken = function(){
    // generate a long and random string 
    const token = crypto.randomBytes(20).toString('hex');
    // getting a hash on backend 
    this.forgotPasswordToken = crypto.createHash('sha256').update(token).digest("hex")
    // time of token 
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000 

    return token  
}



module.exports = mongoose.model('User', userSchema )