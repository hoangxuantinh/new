require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_SERVER_USERNAME,
        password: process.env.DB_SERVER_PASSWORD,
        database: process.env.DB_SERVER_DEVELOPMENT,
        host: process.env.DB_SERVER_HOST,
        dialect: 'mysql',
        logging: false
    },
    test: {
        username: process.env.DB_SERVER_USERNAME,
        password: process.env.DB_SERVER_PASSWORD,
        database: process.env.DB_SERVER_TEST,
        host: process.env.DB_SERVER_HOST,
        dialect: 'mysql',
        logging: false
    },
    production: {
        username: process.env.DB_SERVER_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_SERVER_HOST,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};
