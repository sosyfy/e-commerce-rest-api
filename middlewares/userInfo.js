const jwt = require("jsonwebtoken");
const User = require("../models/user")
const CustomError = require("../utils/customErrors")
const BigPromise = require("./bigPromise")


exports.isLoggedIn = BigPromise(async ( req ,res , next )=> {

    const token  = req.cookies.token  || req.header("Autherization")?.replace("Bearer ", "");
    
    if ( !token ) {
       return  next( new CustomError("Login first to access this page", 404))  
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await User.findById(decoded.id)

    next()

})

exports.customRole = (...roles ) => {
  
    return ( req , res ,next ) => {
        if ( !roles.includes(req.user.role) ) {
           return next( new CustomError("You do not have rights to access this")) 
        } 

        next()
    }
}