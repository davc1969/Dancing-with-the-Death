const routes = require("express").Router();
const fs = require("fs");
const { StatusCodes: httpCodes } = require("http-status-codes");
const httpError = require("../utils/httpErrorsHandler");
const cOut = require("../utils/cOut");
const { API_Path } = require("../config/config")

const pathRouter = `${__dirname}`;

const removeExtensionFromFile = (fileName) => {
    return fileName.split(".").shift();
}

//! This code loads the routes files in this folder, so you dont need to load them from the index.js
fs.readdirSync(pathRouter).filter( (file) => {
    const filenameWithoutExtension = removeExtensionFromFile(file);
    const skipFile = ["routes"].includes(filenameWithoutExtension);
    if (!skipFile) {
        routes.use(`${API_Path}/${filenameWithoutExtension}`, require(`./${filenameWithoutExtension}`));
        cOut.bgblue("   ...loading router file: " + filenameWithoutExtension);
    }
});

routes.get("/", (req, res) => {
    res.status(httpCodes.OK)
    cOut.info("We are in the right path")
    res.sendFile("./index.html")
});


routes.get("*", (req, res) => {
    cOut.error("We are in the not found path")
    httpError(httpCodes.NOT_FOUND, res)
})


module.exports = {routes}