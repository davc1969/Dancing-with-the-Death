
const apiResponse = {
    OK : true,
    code : 0,
    message : "",
    data : []
};

const apiMessages = {
    0: "ok",
    1001: "appointment created succesfully",
    1002: "appointment updated succesfully",
    1003: "appointment deleted succesfully",
    1004: "all appointments listed",
    1005: "specific appointment listed",
    1006: "appointments filtered by date",

    1100: "unknown error in api",
    1101: "date/time already taken.  Select another date/time",
    1102: "date/time out of available period.  Select another date/time",
    1104: "appointment not found",
    1105: "no appointments to show",
    1106: "person already registered"

}

module.exports = {
    apiResponse,
    apiMessages
}