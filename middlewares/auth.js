const middleware = require('./middlewares');
const log = require('../helper/log');
const ErrorResponse = require('../helper/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
    protectRoute: middleware.handleAsync(async(req, res, next)=>{
        //check for token
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            //split token string and store in token varible
            token = req.headers.authorization.split(' ')[1];
        }else if(req.cookies.token){
                token = req.cookies.token;
        }
        //check for token
        if(!token){   
            return next(new ErrorResponse('NOT AUTHORIZE', 401));
        }
        //decode token
        try {
            const decoded = jwt.verify(token, process.env.JSONWEB_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (err) {
            return next(new ErrorResponse('NOT AUTHORIZE', 401));
        } 
    }),
    authorize: function(...roles){
        return (req, res, next)=>{
            if(!roles.includes(req.user.role)){
                return next(new ErrorResponse('NOT AUTHORIZE', 401));
            }
            next();
        }
    }
}