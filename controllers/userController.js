const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customErrors')
const cookieToken = require('../utils/cookieToken')
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')


exports.signUp = BigPromise( async( req , res ,next )=>{
    const { firstName , lastName , email , password } = req.body 

    if(!email || !firstName || !lastName || !password ) {
       return next( new CustomError("please send all details" , 404))
    }

  const user = await User.create({
        firstName ,
        lastName ,
        email ,
        password
    })

  cookieToken(user , res );

})

exports.login = BigPromise( async ( req ,res ,next )=>{
    const { email , password } = req.body 

    if ( !email || !password ) {
        return next( new CustomError( "please provide email and password" , 400))
    }


    const user = await User.findOne({ email }).select("+password")

    if(!user ) {
        
        return next( new CustomError("huyuko kwa db bro " , 400 ))
    }

    const isPasswordCorrect = await user.isValidatedPassword(password)

    if(!isPasswordCorrect ) {
        return next( new CustomError("password is incorrect" , 400 ))
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
        return next( new CustomError("Please pass an Email First"))
    }

   const user = await User.findOne({email})

   if (!user) {
    return next( new CustomError("user not found "))
   }

   const forgotToken = user.getForgetPasswordToken();

   await  user.save({ validateBeforeSave: false })

  const url = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgotToken}`

  const message = `copy paste this link in our Url and hit enter \n\n ${url}`

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
  
    return next( new CustomError(error.message ,500 ))
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
       return next(new CustomError("Token is invalid or expired", 400 ))  
    }

   console.log(user);

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
        return next( new CustomError("Please enter your previous password"))
    }

    const user = await User.findById(req.user.id).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(oldPassword)
    
    if (!isCorrectOldPassword) {
        return next( new CustomError("Old password is incorrect"))
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







