// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_BACKEND_TEST, 'root', process.env.PASSWORD_BACKEND, {
    host: process.env.HOST_BACKEND,
    dialect: 'mysql',
    logging: false
});

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connection has been established db ${process.env.DB_BACKEND_TEST} successfully.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
export default connectDb;
