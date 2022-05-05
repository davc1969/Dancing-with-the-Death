const { StatusCodes: httpCodes } = require("http-status-codes");
const httpError = require("../utils/httpErrorsHandler");
const poolQuery = require("../db/pg_pool_services").pgPoolQuery;
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");
const { postAppointmentSchema, updateAppointmentSchema } = require("../config/joi");
const { validateSchema } = require("../utils/joi");
const cOut = require("../utils/cOut")


const checkAppointmentTime = (appointmentDate, appointmentTime) => {
    const dateApp = new Date(appointmentDate + " " + appointmentTime);
    const day = dateApp.getDay();
    const hour = dateApp.getHours();
    

    return ( day > 0 && day <= 4 && hour >= 9 && hour <= 18)
}


const getAppointments = async (req, res) => {
    const querySQL = {
        text: "Select * from appointments;",
        values: []
    }
    try {
        const results = await poolQuery(querySQL);
        res.status(httpCodes.OK);
        res.send( results )
    } catch (error) {
        cOut.error("error: ", error);
        httpError(httpCodes.BAD_REQUEST, res)
    }
};

const getAppointment = async (req, res) => {
    const querySQL = {
        text: "Select * from appointments where id = $1;",
        values: [req.params.id]
    }
    try {
        const results = await poolQuery(querySQL);
        res.status(httpCodes.OK);
        res.send( results )
    } catch (error) {
        cOut.error("error: ", error);
        httpError(httpCodes.BAD_REQUEST, res)
    }
};



const createAppointment = async (req, res) => {

    req.body.id = uuidv4().slice(0, 10);
    const querySQL = {
        text: "insert into appointments (id, name, age, gender, email, date, hour) values ($1, $2, $3, $4, $5, $6, $7);",
        values : [
            req.body.id,
            req.body.name,
            req.body.age,
            req.body.gender,
            req.body.email,
            req.body.date,
            req.body.hour
        ]
    }

    const validTime = checkAppointmentTime(req.body.date, req.body.hour)
    const { error, value } = postAppointmentSchema.validate(req.body)

    if (!error) {
        if (!validTime) {
            cOut.error("Appointment out of available period");
            res.status(httpCodes.FORBIDDEN);
            res.send( { result: httpCodes.FORBIDDEN,
                        message: "selected date/time not available for dance with the Death" } )
        } else {
            try {
                const results = await poolQuery(querySQL);
                cOut.warning("are we here?")
                res.status(httpCodes.CREATED);
                res.send( { result: httpCodes.CREATED,
                            message: "New appointment accepted" } )
                cOut.info("appointment accpeted")
            } catch (error) {
                cOut.error("error: ", error);
                httpError(httpCodes.BAD_REQUEST, res)
            }
        }
    } else {
        res.send( error )
    }

};

const updateAppointment = async (req, res) => {
    const querySQL = {
        text: `update appointments set 
        name = $1, 
        age = $2, 
        gender = $3, 
        email = $4, 
        date = $5, 
        hour = $6, 
        updated_at = to_timestamp($7) 
        where id = $8;`,
        values : [
            req.body.name,
            req.body.age,
            req.body.gender,
            req.body.email,
            req.body.date,
            req.body.hour,
            Date.now() / 1000,
            req.params.id
        ]
    }
    try {
        const results = await poolQuery(querySQL);
        if (results.length > 2) {
            res.status(httpCodes.ACCEPTED);
            res.send( { result: httpCodes.ACCEPTED,
                        message: "Appointment succesfully updated" } )
        } else {
            throw httpCodes.NOT_FOUND
        }
    } catch (error) {
        cOut.error("error: ", error);
        httpError(error, res)
    }
};

const deleteAppointment = async (req, res) => {
    const querySQL = {
        text: "delete from appointments where id = $1;",
        values: [req.params.id],
        rowMode: Array
    }
    try {
        const results = await poolQuery(querySQL);
        if (results.length > 2) {
            cOut.warning("results delete ", results.length)
            res.status(httpCodes.ACCEPTED);
            res.send( { result: httpCodes.ACCEPTED,
                        message: "Appointment succesfully deleted" } )
        } else {
            cOut.error("Nada que borrar")
            res.status(httpCodes.NOT_FOUND);
            res.send( { result: httpCodes.NOT_FOUND,
                        message: "Appointment not found" } )
        }
    } catch (error) {
        cOut.error("error: ", error);
        httpError(httpCodes.BAD_REQUEST, res)
    }
}






module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment
}

