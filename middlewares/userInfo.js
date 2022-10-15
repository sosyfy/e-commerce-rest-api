const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { unauthorizedResponse } = require("../utils/apiResponse");
const CustomError = require("../utils/customErrors")
const BigPromise = require("./bigPromise")


//& Function to check if user is logged in 

exports.isLoggedIn = BigPromise(async ( req ,res , next )=> {
    //& first get jwt token from user using preffered method 

    const token = req.cookies.token  || req.header("Autherization")?.replace("Bearer ", "");
    
    //& if no token present send them the error 
    
    if ( !token ) {
        unauthorizedResponse(res ,"Login first to access this page" )
        return  next( new CustomError(404 , false , "Login first to access this page" ))  
    }
    
    //& validate the token  

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (!decoded ) {
      unauthorizedResponse(res ,"Token is invalid")  
      return  next( new CustomError(404 , false , "Token is invalid" )) 
    }

    //& set the user model 
    req.user = await User.findById(decoded.id)

    //& execute the next function 

    next()

})


//& Function to check role 

exports.customRole = (...roles ) => {
  
    return ( req , res ,next ) => {

    //& check if user role in Db  is same to the one provided 
        if ( !roles.includes(req.user.role) ) {
          unauthorizedResponse(res , "You do not have rights to access this" )   
           return next( new CustomError( 404 , false , "You do not have rights to access this")) 
        }
         
    //& else execute next function 
        next()
    }
}