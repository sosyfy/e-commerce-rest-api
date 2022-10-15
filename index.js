const app = require('./app');
const connectWithDb = require('./configs/db');
require('dotenv').config()
const PORT = process.env.PORT


connectWithDb();

app.listen( PORT , ()=>{
    console.log(`server is running on port ${PORT}` );
})