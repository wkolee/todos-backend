const Joi = require('@hapi/joi');
const log = require('../helper/log');


const registerValidation = (data)=>{
     schema = Joi.object({
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        ,
        password: Joi.string()
        .min(6)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });
    return schema.validate(data);

}

const loginValidation = (data)=>{
    schema = Joi.object({
       email: Joi.string()
       .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
       password: Joi.string()
       .min(6)
       .max(30)
       .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
   });
   return schema.validate(data);

}


module.exports = registerValidation, loginValidation;