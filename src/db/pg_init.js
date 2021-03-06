const { Pool, Client } = require("pg");
const { pg_config } = require("../config/config")



const config = pg_config;


//************* Singleton Pool from pg ilbrary */
class CustomPool {
    
    constructor() {
        if(!CustomPool.instance) {
            CustomPool.instance = this;
        }

        return CustomPool.instance;
    }

    getPoolInstance() {
        if(!CustomPool.poolInstance) {
            CustomPool.poolInstance = new Pool(config);
        }
        return CustomPool.poolInstance;
    }
}

const instancePool = new CustomPool();
Object.freeze(instancePool);


//************* Singleton Client from pg ilbrary */
class CustomClient {
    
    constructor() {
        if(!CustomClient.instance) {
            CustomClient.instance = this;
        }

        return CustomClient.instance;
    }

    getClientInstance() {
        if(!CustomClient.poolInstance) {
            CustomClient.poolInstance = new Client(config);
        }
        return CustomClient.poolInstance;
    }
}

const instanceClient = new CustomClient();

Object.freeze(instanceClient);



module.exports = {
    instancePool,
    instanceClient
}