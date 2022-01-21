// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }
require('dotenv').config();

module.exports = {
    development: {
        username: 'root',
        password: null,
        database: process.env.DB_BACKEND_DEVELOPMENT,
        host: '127.0.0.1',
        dialect: 'mysql'
    },
    test: {
        username: 'root',
        password: null,
        database: process.env.DB_BACKEND_TEST,
        host: '127.0.0.1',
        dialect: 'mysql'
    }
};
