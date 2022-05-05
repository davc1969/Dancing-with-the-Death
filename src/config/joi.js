const Joi = require("joi");

const postAppointmentSchema = Joi.object( {

    id:    Joi.required(),
    name:   Joi.string().required(),
    age:    Joi.number().integer().max(100).min(18).required(),
    gender: Joi.string().length(1).allow("m", "M", "f", "F").required(),
    email:  Joi.string().email().required(),
    date:   Joi.date().required(),
    hour:   Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required()
});

const updateAppointmentSchema = Joi.object( {

    name:   Joi.string().required(),
    age:    Joi.number().integer().max(100).min(18).required(),
    gender: Joi.string().length(1).allow("m", "M", "f", "F").required(),
    email:  Joi.string().email().required(),
    date:   Joi.date().required(),
    hour:   Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required()

});

//! Schema for users
const usersSchema = Joi.object( {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().required().valid("ADMIN", "USER")
})


module.exports = {
    postAppointmentSchema,
    updateAppointmentSchema
}