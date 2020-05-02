const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');
const resgisterValidation = require('../helper/joi');
const loginValidation = require('../helper/joi');
const log = require('../helper/log');
const ErrorResponse = require('../helper/errorResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Todos = require('../models/toDos');


module.exports = {
    register : middlewares.handleAsync(async (req, res, next)=>{
        //validate user before resgistering them
        const {error} = resgisterValidation(req.body);        
        if(error){
            let msg = error.message;
            msg = msg.replace(/"/g, "'");
            return next(new ErrorResponse(`${msg}`, 400))
        }
        // user password is hash in user model
        const user = await (await User.create(req.body));
        //total user
        let totalUser = await User.collection.countDocuments();

        //generate token(user sign token)
        sendTokenResponse(user, totalUser, 200, res )
    }),


    login: middlewares.handleAsync(async(req, res, next)=>{
        const {email, password} = req.body;
        //validate login info 
        const {error} = loginValidation(req.body);
        if(error){
            let msg = error.message;
            msg = msg.replace(/"/g, "'");
            return next(new ErrorResponse(`${msg}`, 400));
        } 

        //find user email if it exist
        const user = await User.findOne({email}).select('+password');
        let totalUser = await User.collection.countDocuments();
        if(!user){
            return next(new ErrorResponse('Wrong credentials ' , 400));
        }
        //unhash password
        const hashPassword = await bcrypt.compare(password, user.password);
    
        //generate a token
        sendTokenResponse(user, totalUser, 200, res)
    }),
    profile: middlewares.handleAsync(async (req, res, next)=>{
        const user = await User.find(req.user);
        if(!user){return next(new ErrorResponse('user does not exist', 404))}
        if(user[0]._id != req.user.id){
            return next(new ErrorResponse('NOT AUTHRIZE', 401));
        }
        //==find the current user todos====
        const userTodos = await Todos.find().find({user: req.user.id});
        res.status(200).json({
            success: true,
            user,
            userTodos
        });

    })
}

const sendTokenResponse = (user, totalUser, statusCode, res)=>{
    const token = jwt.sign({
        id: user._id
    }, process.env.JSONWEB_SECRET, { expiresIn: 60 * 60 });
    options = {
    expires: new Date(Date.now() + 60 * 60 * 1000) ,// 1 hour
    httpOnly: true
    };
    log(totalUser);
    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        totalUser,
        user,
        token
    });
}