const app = require('./app');
const connectWithDb = require('./configs/db');
require('dotenv').config()


connectWithDb();

const PORT = process.env.PORT

app.listen( PORT , ()=>{
    console.log(`server is running on port ${PORT}` );
})