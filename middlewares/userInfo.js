const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { unauthorizedResponse } = require("../utils/apiResponse");
const CustomError = require("../utils/customErrors")
const BigPromise = require("./bigPromise")



exports.isLoggedIn = BigPromise(async ( req ,res , next )=> {

    const token  = req.cookies.token  || req.header("Autherization")?.replace("Bearer ", "");
    
    if ( !token ) {
       unauthorizedResponse(res ,"Login first to access this page" )
       return  next( new CustomError(404 , false , "Login first to access this page" ))  
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await User.findById(decoded.id)

    next()

})

exports.customRole = (...roles ) => {
  
    return ( req , res ,next ) => {
        if ( !roles.includes(req.user.role) ) {

          unauthorizedResponse(res , "You do not have rights to access this" )
              
           return next( new CustomError( 404 , false , "You do not have rights to access this")) 
        } 

        next()
    }
}