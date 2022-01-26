// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_SERVER_TEST, 'root', process.env.DB_SERVER_PASSWORD, {
    host: process.env.HOST_URL_SERVER,
    dialect: 'mysql',
    logging: false
});

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connection has been established db ${process.env.DB_SERVER_TEST} successfully.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
export default connectDb;
