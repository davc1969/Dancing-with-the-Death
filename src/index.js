const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config( { path: path.resolve(__dirname, "./.env") } );
const cors = require("cors");
const {routes} = require ("./routes/routes");
const cOut = require("./utils/cOut");
const swaggerDocs = require("./middlewares/swagger");
const startMorganLogger = require("./middlewares/morgan");
const { startJoiService } = require("./utils/joi");
const { startMailService } = require("./utils/nodemailer");
const startHandleBarsService = require("./middlewares/handlebars");
const { initializeJWT } = require("./utils/jwt");
const { pgDBInit } = require("./db/pg_pool_services");


const { PORT, LOGFILE } = require("./config/config")

app.use(cors());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../public")));

pgDBInit();   
startHandleBarsService(app);
initializeJWT();
startMorganLogger(app, __dirname + LOGFILE); 
startJoiService();
startMailService();
swaggerDocs(app, PORT);  //! start swagger service for api documentation

//  routes
app.use(routes);

app.listen(PORT, ( () => {
    cOut.info(`Server is running on port ${PORT}, process ${process.pid}`);
}));




module.exports = app