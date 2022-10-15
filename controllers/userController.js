const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const cookieToken = require('../utils/cookieToken')
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')
const { validationErrorWithData, ErrorResponse } = require('../utils/apiResponse')


exports.signUp = BigPromise( async( req , res ,next )=>{
    const { firstName , lastName , email , password } = req.body 

    if(!email || !firstName || !lastName || !password ) {
        validationErrorWithData(res, "All feilds are required", req.body)

       return next( new CustomError(404 , false , "please send all details" ))
    }

  const user = await User.create({
        firstName ,
        lastName ,
        email ,
        password
    }).catch((error )=> {
        ErrorResponse(res, "Something happened when creating user", error )
    })

  cookieToken(user , res );

})



exports.login = BigPromise( async ( req ,res ,next )=>{
    const { email , password } = req.body 

    if ( !email || !password ) {

        validationErrorWithData( res, "All feilds are required, please provide an email and a password", req.body )

        return next( new CustomError( 404 , false,  "please provide email and password"))
    }


    const user = await User.findOne({ email }).select("+password")

    if(!user ) {

        ErrorResponse(res, "User not found" )
        return next( new CustomError(404 ,false , "User not found"))
    }

    const isPasswordCorrect = await user.isValidatedPassword(password)

    if(!isPasswordCorrect ) {
        ErrorResponse(res, "Password is incorrect" )

        return next( new CustomError( 404 , false , "password is incorrect"))
    }

    cookieToken( user , res)

})


exports.logout = BigPromise(async ( req , res ,next )=>{

    res.cookie('token' , null , {expires: new Date(Date.now()) , httpOnly : true } )

    res.status(200).json({
        success:true ,
        message : "logout success"
    })
})


exports.forgotPassword = BigPromise(async ( req , res ,next )=>{

    // first part of password reseting 

  const { email } = req.body 

    if(!email){

        validationErrorWithData(res, "Please pass an Email First", req.body)

        return next( new CustomError(404, false , "Please pass an Email First"))
    }

   const user = await User.findOne({email})

   if (!user) { 
    ErrorResponse(res, "User not found" )

    return next( new CustomError( 404 , false , "user not found "))
   }

   const forgotToken = user.getForgetPasswordToken();

   await  user.save({ validateBeforeSave: false })

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
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry  = undefined

    await  user.save({ validateBeforeSave: false })
  
    return next( new CustomError( 500, false , error.message))
  }


})

exports.passwordReset = BigPromise(async ( req , res ,next )=>{

    const token = req.params.token 

    const encryptedToken = crypto.createHash('sha256').update(token).digest("hex")

    const user = await User.findOne({
        forgotPasswordToken :encryptedToken, 
        forgotPasswordExpiry: { $gt: Date.now()}
    })

    if (!user ) {

        ErrorResponse(res, "Token is invalid or expired" )

       return next(new CustomError(404, false , "Token is invalid or expired"))  
    }

   user.password = req.body.password

   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry  = undefined

   await  user.save({ validateBeforeSave: false })
 
   cookieToken(user , res )

})

exports.LoggedInUserDetails = BigPromise( async ( req , res ,next )=> {
     const user = await User.findById(req.user.id)

     res.status(200).json({
        success: true,
        user
     })
})

exports.passwordUpdate = BigPromise( async ( req , res ,next )=> {
    const { oldPassword, newPassword } = req.body 

    if (!oldPassword) {

        validationErrorWithData(res, "Please enter your previous password", req.body)

        return next( new CustomError(404, false , "Please enter your previous password"))
    }

    const user = await User.findById(req.user.id).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(oldPassword)
    
    if (!isCorrectOldPassword) {
        validationErrorWithData(res, "Old password is incorrect")
        
        return next( new CustomError( 404 , false , "Old password is incorrect"))
    }

    user.password = newPassword

    await user.save()

   cookieToken(user , res )
})

exports.LoggedInUserDetailsUpdate = BigPromise( async ( req , res ,next )=> {
    const userId = req.user.id 

    const newData = {
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       role : req.body.role 
    }

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


exports.adminAllUsers = BigPromise( async ( req , res ,next )=> {

    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})







