const { PORT } = require("../config/config");


const swaggerOptions = {
    openapi: "3.0.0",
    info: {
        title: "appointments API",
        description: "API to handle basic CRUD operations with appointments to dance with the Death",
        version: "1.0",
        contact: {
            name: "Darío Valenzuela",
            email: "dario.valenzuela@gmail.com"
        }
    },
    consumes: [ "application/json" ],
    produces: [ "application/json" ],
    servers: [
        {
            url: `http://localhost:${PORT}/api/1.0`,
            description: "development server for appointments info"
        }
    ],
    apis: ["../routes/appointments.js"],
    components: {
        schemas: {
            Appointments: {
                type: "object",
                properties: {
                    id:     { type: "String", definition: "id of the appointment (set by system)" },
                    name:   { type: "String", definition: "name of person setting the appointment" },
                    age:    { type: "Number", definition: "age of the person.  It must be an adult (over 18)"  },
                    gender: { type: "String", definition: "1 letter, F(emale) or M(ale)" },
                    email:  { type: "String", definition: "a valid email for registry" },
                    date:   { type: "Date",   definition: "date of the appointment" },
                    hour:   { type: "String", definition: "Start hour of the appointment" },
                },
                example: {
                    id: "01c6c7a8-b",
                    name: "Dorian Gray",
                    age: "100",
                    gender: "M",
                    email: "dorian.gray@thehell.com",
                    date: "2021/12/31",
                    hour: "00:00"
                },
                required: [ 
                    "id",
                    "name",
                    "age",
                    "gender",
                    "email",
                    "date",
                    "hour"
                ]
            }
        }
    },

    paths: {
        "/appointments": {
            "post": {
                tags: ["appointments"],
                summary: "set a new appointment to dance with the Death",
                requestBody: {
                    description: "json with the appointment information",
                    content: {
                        "application/json" : {
                            schema: {
                                $ref: '#components/schemas/Appointments'
                            }
                        }
                    },
                    required: true
                },
                responses: {
                    201: {
                        description: "succesful operation, New appointment created",
                        content: {
                            "application/json" : {
                                schema: {
                                    $ref: "#components/schemas/Appointments"
                                }
                            }
                        }
                    },
                    404: {
                        description: "resource not found"
                    }
                }
            },
            "get": {
                tags: ["appointments"],
                summary: "list all appointments in the database",
                responses: {
                    200: {
                        description: "succesful operation, list of all appointments created",
                        content: {
                            "application/json" : {
                                schema: {
                                    $ref: "#components/schemas/Appointments"
                                }
                            }
                        }
                    },
                    404: {
                        description: "resource not found"
                    }
                }
            }
        },
        "/appointments/{id}": {
            "get": {
                tags: ["appointments"],
                summary: "list one specific appointment in the database by its id",
                parameters: [{
                    name: "id",
                    in: "path",
                    description: "id of the required appointment",
                    required: true,
                    type: "String"
                }],
                responses: {
                    200: {
                        description: "succesful operation, list the requested appointment",
                        content: {
                            "application/json" : {
                                schema: {
                                    $ref: "#components/schemas/Appointments"
                                }
                            }
                        }
                    },
                    404: {
                        description: "resource not found"
                    }
                }
            },
            "delete": {
                tags: ["appointments"],
                summary: "delete one specific appointment in the database by its id",
                parameters: [{
                    name: "id",
                    in: "path",
                    description: "id of the required payment",
                    required: true,
                    type: "String"
                }],
                responses: {
                    202: {
                        description: "appointment succesfully deleted",
                    },
                    404: {
                        description: "resource not found"
                    }
                }
            },
            "put": {
                tags: ["appointments"],
                summary: "edit one specific appointment in the database by its id",
                requestBody: {
                    description: "json with the appointment information to be updated",
                    content: {
                        "application/json" : {
                            schema: {
                                $ref: '#components/schemas/Appointments'
                            }
                        }
                    },
                    required: true
                },
                parameters: [{
                    name: "id",
                    in: "path",
                    description: "id of the required appointment",
                    required: true,
                    type: "String"
                }],
                responses: {
                    202: {
                        description: "appointment succesfully updated",
                    },
                    404: {
                        description: "resource not found"
                    }
                }
            }
        }
    }
}



module.exports = swaggerOptions