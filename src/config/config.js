require("dotenv").config();

const config = {

        PORT : process.env.PORT || 3000,

        API_Path : "/api/1.0",

        authKey: process.env.AUTH_KEY || "simpleKey",

        Mongo_DB_URI : (process.env.NODE_ENV == "test") ? process.env.DB_URI_TEST : process.env.DB_URI,

        LOGFILE : process.env.LOGFILE || "/log/access.log",

        //email options
        emailHost : process.env.SMTP_HOST,
        emailUser : process.env.SMTP_USER,
        emailPassword : process.env.SMTP_PASSWORD,

        pg_config: {
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                password: process.env.DB_PASSWORD,
                database: (process.env.NODE_ENV == "test") ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
                port: process.env.DB_PORT,
                max: process.env.DB_MAX,
                idleTimeoutMillis: process.env.DB_IDLETIMEOUTMILLIS,
                connectionTimeoutMillis: process.env.DB_CONNECTIONTIMEOUTMILLIS,
        }


}

module.exports = config