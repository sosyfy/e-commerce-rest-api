const express = require("express")
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

//& Allow Cross-Origin requests
app.use(cors());

//& Set security HTTP headers
app.use(helmet());

//& Limit request from the same API 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

//& Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

//& Prevent parameter pollution
app.use(hpp());


//& reqular middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: true }))

//& coookies and file upload 

app.use(cookieParser())
app.use(fileUpload())


//& morgan middleware  to display logs on console of visited routes 
app.use(morgan("tiny"))

//& swagger ui documentation for api's 
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//& import all routes here 

const home = require('./routes/home')
const user = require('./routes/userRoute')
const product = require('./routes/productsRoute')
const order = require('./routes/orders')
const brand = require('./routes/brandRoute')
const category = require('./routes/categoryRoute')
const subcategory = require('./routes/subCategoryRoute')
const orderStatus = require('./routes/orderStatusRoute')

//& Router middleware 

app.use('/api/v1', home )
app.use('/api/v1', user )
app.use('/api/v1', product )
app.use('/api/v1', order )
app.use('/api/v1', brand )
app.use('/api/v1', category )
app.use('/api/v1', subcategory )
app.use('/api/v1', orderStatus )




module.exports = app; 