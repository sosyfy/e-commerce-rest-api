//& The function creates a token then creates a cookie and sends to user 

const cookieToken = (user , res )=>{
   
    const token = user.getJwtToken()
    const options = {
      expires: new Date( Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000 ),
      httpOnly : true 
    }
    
    //& remember not to send the password 
    
    user.password = undefined 
    
    res.status(200).cookie('token', token , options ).json({
      success : true ,
      token: token,
      user : user 
    })
}



module.exports = cookieToken 