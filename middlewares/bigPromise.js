//& a custom promise to help catch errors more easily 

module.exports = (func) => (req , res , next) =>  
 Promise.resolve( func(req, res ,next  )).catch(next)