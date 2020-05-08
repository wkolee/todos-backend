const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');
const resgisterValidation = require('../helper/joi');
const loginValidation = require('../helper/joi');
const log = require('../helper/log');
const ErrorResponse = require('../helper/errorResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Todos = require('../models/toDos');
const sendMail = require('../helper/sendEmail');
const crypto = require('crypto');



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
        const user = await User.create(req.body);
       
       

        //generate token(user sign token)
        sendTokenResponse(user, 200, res )
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

        //check email first
        const user = await User.findOne({email}).select('+password');

        if(!user){
            return next(new ErrorResponse('Wrong credentials ' , 400));
        }
        //unhash password
        const hashPassword = await bcrypt.compare(password, user.password);
        //check if password match
        if(!hashPassword){
            return next(new ErrorResponse('Wrong credentials ' , 400));
        }
    

        //generate a token after succesful login
       sendTokenResponse(user, 200, res)
        
    }),
    logout: middlewares.handleAsync(async(req,res,next)=>{
        res.cookie('token', 'none', {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({success: true})
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

    }),

    forgotPassword: middlewares.handleAsync(async (req, res, next)=>{
        //find user by email
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){return next(new ErrorResponse(`There is no account with the email of ${req.body.email}`, 404))}
        const token = user.token();
        //reset password link
        const urlLink = `http://${req.get('host')}/api/auth/resetpassword/${token}`;
        
        //send reset link to user email
        let options = {
            from: `"${process.env.FROM_NAME} 👻" <${process.env.FROM_EMAIL}>`, // sender address
            to: user.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `Please follow the link to reset your password ${urlLink}` // html body
          };
        sendMail(options);
        //save user reset token
        user.save({validateBeforeSave: false});
        res.status(200).json({
            success: true,
            msg: `A password reset link been sent to ${user.email}`
        });
}),
    resetPassword: middlewares.handleAsync(async(req, res, next)=>{
        //hash incoming token
        resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

        //retrive user
        const user = await User.findOne({resetPasswordToken, resetPasswordExpire :{
            $gte: Date.now()
        }});

        //set password 
        
        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save(user);
      
        res.status(200).json({
            success: true,
            msg: 'Password updated successfully'
        });
    })
}

const sendTokenResponse = (user, statusCode, res)=>{
    const token = jwt.sign({
        id: user._id
    }, process.env.JSONWEB_SECRET, { expiresIn: 60 * 60 });
    options = {
    expires: new Date(Date.now() + 60 * 60 * 1000) ,// 1 hour
    httpOnly: true
    };
   
    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        user,
        token
    });
}