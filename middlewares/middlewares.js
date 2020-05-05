const log = require('../helper/log');
const ErrorResponse = require('../helper/errorResponse');


module.exports = {

    handleAsync: function(asyncFunction){
        return (req, res, next)=>{
            Promise
            .resolve(asyncFunction(req, res, next))
            .catch(next);
            
        }
    },
    handleError: function(err, req, res, next){
        let error = { ...err };
        error.message = err.message;
        log(err)
     

        //check for cast error
        if(err.name === 'CastError'){
            const message = `Invalid params ID or ID does not exist ` 
            error = new ErrorResponse(message, 404);
        }

        //handle validation error
        if(err.name === 'ValidationError'){
            let msg = Object.values(err.errors).map(val=>val.message);
            msg.forEach(val => {
                message = val;
                error = new ErrorResponse(val, 404);
            });
        }
        //handle duplicate key value
        if(err.code === 11000){
            message = `there's a user with the email of '${req.body.email}' already`;
            error = new ErrorResponse(message, 400);
        }
        
        /*//handle type error
        if(err.name === 'TypeError'){

        }
        */
        
//send response 
        res.status(
            error.statusCode || 500
        ).json({
            success: false,
            error: error.message || 'problem with server'
        });
        next();
    }
}

