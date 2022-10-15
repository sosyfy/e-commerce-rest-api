const mongoose = require('mongoose')
//& Function to connect to Db 

const connectWithDb = () => {

    mongoose.connect(process.env.DB_URL, {
        //& must add in order to not get any error masseges:
        useUnifiedTopology:true,
        useNewUrlParser: true 
    }).then(
        console.log("DB CONNECTED SUCCESS")
    ).catch(error => {
        console.log("DB CONNECTION FAILED ", error)
        process.exit(1)

    })
}


module.exports = connectWithDb