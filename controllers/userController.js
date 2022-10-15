const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const cookieToken = require('../utils/cookieToken')
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')

const { validationErrorWithData, ErrorResponse } = require('../utils/apiResponse')

//& sign up a user function

exports.signUp = BigPromise( async( req , res ,next )=>{
    
    const { firstName , lastName , email , password, role } = req.body 
    //& data validtion from frontend 

    if(!email || !firstName || !lastName || !password ) {
        validationErrorWithData(res, "All feilds are required", req.body)
       return next( new CustomError(404 , false , "please send all details" ))
    }

    //& Creating a user in the database 

    const user = await User.create({
            firstName ,
            lastName ,
            email ,
            password
        }).catch((error )=> {
            ErrorResponse(res, "Something happened when creating user", error )
        })
    
    //& sending a token after user creation 
    cookieToken(user , res );

})

// & login user function 

exports.login = BigPromise( async ( req ,res ,next )=>{
    const { email , password } = req.body 

    //& data validtion from frontend 
    if ( !email || !password ) {

        validationErrorWithData( res, "All feilds are required, please provide an email and a password", req.body )

        return next( new CustomError( 404 , false,  "please provide email and password"))
    }
 
   //& Check if user exists in db if yes fetch them 

    const user = await User.findOne({ email }).select("+password")

    if(!user ) {

        ErrorResponse(res, "User not found" )
        return next( new CustomError(404 ,false , "User not found"))
    }

    //& validating the password if they match with one from Db 

    const isPasswordCorrect = await user.isValidatedPassword(password)

    if(!isPasswordCorrect ) {
        ErrorResponse(res, "Password is incorrect" )

        return next( new CustomError( 404 , false , "password is incorrect"))
    }

    //& sending a token after validation  
    cookieToken( user , res)

})

//& logout  user function 

exports.logout = BigPromise(async ( req , res ,next )=>{
    

    res.cookie('token' , null , { expires: new Date(Date.now()) , httpOnly : true } )
   
    res.status(200).json({
        success:true ,
        message : "logout success"
    })
})

//& Send forget password email function 

exports.forgotPassword = BigPromise(async ( req , res ,next )=>{

  const { email } = req.body 
   
    //& data validtion from frontend 

    if(!email){

        validationErrorWithData(res, "Please pass an Email First", req.body)

        return next( new CustomError(404, false , "Please pass an Email First"))
    }
   
    //&  check if user exists in the DB 

   const user = await User.findOne({email})

   if (!user) { 
    ErrorResponse(res, "User not found" )
    return next( new CustomError( 404 , false , "user not found "))
   }

   //& Create a token and save it in the database 

   const forgotToken = user.getForgetPasswordToken();

   await  user.save({ validateBeforeSave: false })

  //& Send the user a reset pasword to their email 

  const url = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgotToken}`

  const message = `Copy paste this link in our Url and hit enter \n\n ${url}`

  try {
    
    await mailHelper({
        email : user.email ,
        subject: "Password reset for store ",
        message
    })
   
    res.status(200).json({
        success: true ,
        message : "Email sent Successfully"
    })

  } catch (error) {
    //& if the email wasnt sent we delete the  token from db 

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry  = undefined
    await  user.save({ validateBeforeSave: false })

    //& send an error response 

    ErrorResponse(500, "An Error encountered trying to send the email" , error.message)
    return next( new CustomError( 500, false , error.message))
  }


})

//& Reset password and create new one function 

exports.passwordReset = BigPromise(async ( req , res ,next )=>{

    //& get reset pasword token and encrypt it to match the Db one 

    const token = req.params.token 
    const encryptedToken = crypto.createHash('sha256').update(token).digest("hex")

   //& geet user with same encrypted token and not expired 

    const user = await User.findOne({
        forgotPasswordToken :encryptedToken, 
        forgotPasswordExpiry: { $gt: Date.now()}
    })

    if (!user ) {
        ErrorResponse(res, "Token is invalid or expired" )
       return next(new CustomError(404, false , "Token is invalid or expired"))  
    }

  //& save the new password to Db and  delete the tokens 

   user.password = req.body.password

   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry  = undefined

   await  user.save({ validateBeforeSave: false })
 
 //& send user a new token     
   cookieToken(user , res )

})

//& Get user info details function 

exports.LoggedInUserDetails = BigPromise( async ( req , res ,next )=> {
     
     const user = await User.findById(req.user.id)

     res.status(200).json({
        success: true,
        user
     })
})

//& Update user password function 

exports.passwordUpdate = BigPromise( async ( req , res ,next )=> {
    const { oldPassword, newPassword } = req.body

    //& data validtion from frontend 
    if (!oldPassword) {

        validationErrorWithData(res, "Please enter your previous password", req.body)

        return next( new CustomError(404, false , "Please enter your previous password"))
    }
    
    //& get old password from Db and validate if it is same to the one sent 
    const user = await User.findById(req.user.id).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(oldPassword)
    
    if (!isCorrectOldPassword) {
        validationErrorWithData(res, "Old password is incorrect")

        return next( new CustomError( 404 , false , "Old password is incorrect"))
    }

   //& Update the password and send them a new login token 

    user.password = newPassword

    await user.save()

   cookieToken(user , res )
})

//& Update user details function 

exports.LoggedInUserDetailsUpdate = BigPromise( async ( req , res ,next )=> {
    const userId = req.user.id 

    const newData = {
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       role : req.body.role 
    }

    //& find a user and update them with the new details 
    const user = await User.findByIdAndUpdate(userId , newData , {
        new: true ,
        runValidators: true ,
        useFindAndModify: false 
    })

    res.status(201).json({
        success: true,
        user
    })
})

//& Getting all users from Db 

exports.adminAllUsers = BigPromise( async ( req , res ,next )=> {

    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})







