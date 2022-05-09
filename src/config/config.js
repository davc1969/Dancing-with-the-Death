require("dotenv").config();

const config = {

        PORT : process.env.PORT || 3000,

        HOST : "http://localhost",

        API_Path : "/api/1.0",

        authKey: process.env.AUTH_KEY || "simpleKey",

        Mongo_DB_URI : (process.env.NODE_ENV == "test") ? process.env.DB_URI_TEST : process.env.DB_URI,

        LOGFILE : process.env.LOGFILE || "/log/access.log",

        //email options
        emailHost : process.env.SMTP_HOST,
        emailUser : process.env.SMTP_USER,
        emailPassword : process.env.SMTP_PASSWORD,

        pg_config: {
                user: process.env.PG_USER,
                host: process.env.PG_HOST,
                password: process.env.PG_PASSWORD,
                database: (process.env.NODE_ENV == "test") ? process.env.PG_DATABASE_TEST : process.env.PG_DATABASE,
                port: process.env.PG_PORT,
                ssl: {
                        rejectUnauthorized: false
                }
        }


}

module.exports = config