const { StatusCodes: httpCodes } = require("http-status-codes");
const httpError = require("../utils/httpErrorsHandler");
const poolQuery = require("../db/pg_pool_services").pgPoolQuery;
const { v4: uuidv4 } = require('uuid');
const { postAppointmentSchema, updateAppointmentSchema } = require("../config/joi");
const { validateSchema } = require("../utils/joi");
const cOut = require("../utils/cOut");
const { apiResponse, apiMessages } = require("../models/appointments");


const createApiOutput = (ok, code, data) => {

    return {
        ok,
        code,
        message: apiMessages[code],
        data
    }
}

const checkAppointmentTime = (appointmentDate, appointmentTime) => {
    const dateApp = new Date(appointmentDate + " " + appointmentTime);
    const day = dateApp.getDay();
    const hour = dateApp.getHours();
    return ( day > 0 && day <= 5 && hour >= 9 && hour <= 17)
}

const checkAvailability = async (appointmentDate, appointmentTime) => {
    const querySQL = {
        text: "Select * from appointments where date = $1 and hour = $2;",
        values: [appointmentDate, appointmentTime],
        rowMode: Array
    }
    try {
        const results = await poolQuery(querySQL);
        const data = JSON.parse(results)
        return (data.length === 0)
    } catch (error) {
        cOut.error("error: ", error);
        return 1
    }
}

const checkUniqueness = async (email) => {
    const querySQL = {
        text: "Select email from appointments where email = $1;",
        values: [email],
        rowMode: Array
    }
    try {
        const results = await poolQuery(querySQL);
        const data = JSON.parse(results)
        return (data.length === 0)
    } catch (error) {
        cOut.error("error: ", error);
        return 1
    }
}

const checkForErrors = async (req, res, type) => {
    const validTime = checkAppointmentTime(req.body.date, req.body.hour)
    const isAvailable = await checkAvailability(req.body.date, req.body.hour)
    const isUnique = await checkUniqueness(req.body.email)
    let errorValidation = false
    
    let error = 0;
    if (type == "P") {
        errorValidation = postAppointmentSchema.validate(req.body).error;
    } else {
        errorValidation = updateAppointmentSchema.validate(req.body).error;
    }


    if (errorValidation && (error == 0)) {
        error = 1;
        res.status(httpCodes.BAD_REQUEST);
        res.send( createApiOutput(false, 1100, errorValidation))
    }

    if (type == "P") {
        if (!validTime && (error == 0)) { 
            error = 1;
            res.status(httpCodes.FORBIDDEN)
            res.send( createApiOutput(false, 1102, []) ) 
        }
    
        if (!isAvailable && (error == 0)) { 
            error = 1;
            res.status(httpCodes.FORBIDDEN)
            res.send( createApiOutput(false, 1101, []) )
        }
    
        if (!isUnique && (error == 0)) { 
            error = 1;
            res.status(httpCodes.FORBIDDEN)
            res.send( createApiOutput(false, 1106, []) )
        }
    }

    return error
}


const runQuery = async (req, res, query, httpCodeIfOK, apiCodeIfOk, httpCodeIfNo, apiCodeIfNo, apiCodeIfError) => {
    try {
        const results = await poolQuery(query);
        const data = JSON.parse(results);
        if (data.length > 0) {
            res.status(httpCodeIfOK);
            res.send( createApiOutput(true, apiCodeIfOk, data) )
        } else {
            res.status(httpCodeIfNo);
            res.send( createApiOutput(false, apiCodeIfNo, []) );
        }
    } catch (error) {
        cOut.error("error: ", error);
        res.status(httpCodes.INTERNAL_SERVER_ERROR);
        res.send( createApiOutput(false, apiCodeIfError, []) )
    }
}


const getAppointments = async (req, res) => {
    const querySQL = {
        text: "Select * from appointments;",
        values: []
    }

    runQuery(req, res, querySQL, httpCodes.OK, 1004, httpCodes.NOT_FOUND, 1105, 1100)
    
};

const getAppointment = async (req, res) => {
    const querySQL = {
        text: "Select * from appointments where id = $1;",
        values: [req.params.id]
    }

    runQuery(req, res, querySQL, httpCodes.OK, 1005, httpCodes.NOT_FOUND, 1104, 1100)
    
};

const getAppointmentByDate = async (req, res) => {
    const querySQL = {
        text: "Select * from appointments where date = $1 order by hour asc;",
        values: [req.query.date]
    }

    runQuery(req, res, querySQL, httpCodes.OK, 1006, httpCodes.NOT_FOUND, 1105, 1100)
    
}

const createAppointment = async (req, res) => {

    req.body.id = uuidv4().slice(0, 10);
    const querySQL = {
        text: "insert into appointments (id, name, age, gender, email, date, hour) values ($1, $2, $3, $4, $5, $6, $7) returning *;",
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

    if (await checkForErrors(req, res, "P") == 0) {
        runQuery(req, res, querySQL, httpCodes.CREATED, 1001, httpCodes.BAD_REQUEST, 1100, 1100);
    }

};

const updateAppointment = async (req, res) => {
    const querySQL = {
        text: `update appointments set 
        name = $1, 
        age = $2, 
        gender = $3, 
        updated_at = to_timestamp($4) 
        where id = $5 returning *;`,
        values : [
            req.body.name,
            req.body.age,
            req.body.gender,
            Date.now() / 1000,
            req.params.id
        ]
    }

    if (await checkForErrors(req, res, "U") == 0) {
        runQuery(req, res, querySQL, httpCodes.ACCEPTED, 1002, httpCodes.NOT_FOUND, 1104, 1100);
    }
    
};

const deleteAppointment = async (req, res) => {
    const querySQL = {
        text: "delete from appointments where id = $1 returning *;",
        values: [req.params.id],
        rowMode: Array
    }

    runQuery(req, res, querySQL, httpCodes.ACCEPTED, 1003, httpCodes.NOT_FOUND, 1104, 1100)
    
}


module.exports = {
    getAppointments,
    getAppointment,
    getAppointmentByDate,
    createAppointment,
    updateAppointment,
    deleteAppointment
}

