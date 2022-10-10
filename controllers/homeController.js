const BigPromise = require('../middlewares/bigPromise')

exports.home = BigPromise(( req , res )=>{
    
    console.log(req.body);

    res.status(200).json({
        success : true 
    })
})