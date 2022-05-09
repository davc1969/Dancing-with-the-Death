const appointmentsRoutes = require("express").Router();
const appointmentsController = require("../controllers/appointments");


appointmentsRoutes.get("/", (req, res) => {
    appointmentsController.getAppointments(req, res)
});

appointmentsRoutes.get ("/search", (req, res) => {
    console.log("Entamos a la ruta")
    appointmentsController.getAppointmentByDate(req, res)
});

appointmentsRoutes.get ("/:id", (req, res) => {
    console.log("entramos en id?")
    appointmentsController.getAppointment(req, res)
});


appointmentsRoutes.post("/", (req, res) => {
    console.log("Estamos en la ruta de crear")
    appointmentsController.createAppointment(req, res)
});

appointmentsRoutes.put("/:id", (req, res) => {
    console.log("we are in put")
    appointmentsController.updateAppointment(req, res)
});

appointmentsRoutes.delete("/:id", (req, res) => {
    appointmentsController.deleteAppointment(req, res)
});


module.exports = appointmentsRoutes 