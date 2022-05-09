process.env.NODE_ENV = "test";
const envPath = __dirname + "/../src/.env";
require('dotenv').config({path:envPath})

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index")

chai.should();
chai.use(chaiHttp);


describe("testing API application", () => {

})