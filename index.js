const app = require('./app');
const connectWithDb = require('./configs/db');
require('dotenv').config()


connectWithDb();



app.listen(process.env.PORT , ()=>{
    console.log(`server is running on port ${process.env.PORT}` );
})