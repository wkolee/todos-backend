const express = require('express'),
app = express();
const morgan = require('morgan');
const color = require('colors');
const cookieParser = require('cookie-parser');
//helper console.log message helper
const log = require('./helper/log');
//error middleware
const middleware = require('./middlewares/middlewares');
//toDo route
const todoRoute = require('./routes/toDo');
const authRoute = require('./routes/auth');
//database
require('./config/db')();
//Loads environment variables
require('dotenv')
.config({path: './config/.env'});
//SECURITY
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const limit = require('express-rate-limit');



app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const limiter = limit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

//SECUIRTY
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(limiter);

app.use('/api/toDo', todoRoute);
app.use('/api/auth', authRoute);

//error middle ware have to be after route
app.use(middleware.handleError);
//server
const PORT = process.env.SERVER_PORT || 5000;

//start server
const server = app.listen(PORT, () => {
    log(`SERVER RUNNING ON ${PORT} LOCAL HOST`.blue);
});

//handle unhandle rejection
process.on('unhandledRejection', (err, promise)=>{
    log(`ERROR: ${err.message}`);
    server.close(()=>process.exit(1));
});

