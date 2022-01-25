require('dotenv').config();

module.exports = {
    development: {
        username: process.env.USER_BACKEND,
        password: process.env.PASSWORD_BACKEND,
        database: process.env.DB_BACKEND_DEVELOPMENT,
        host: process.env.HOST_BACKEND,
        dialect: 'mysql',
        logging: false
    },
    test: {
        username: process.env.USER_BACKEND,
        password: process.env.PASSWORD_BACKEND,
        database: process.env.DB_BACKEND_TEST,
        host: process.env.HOST_BACKEND,
        dialect: 'mysql',
        logging: false
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
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
