import dotenv from 'dotenv';
import express from 'express';
import createError from 'http-errors';
import { v4 as uuid } from 'uuid';
import helmet from 'helmet';
// import morgan from 'morgan';
import cors from 'cors';
import configViewEngine from './config/configViewEngine';
import connectDb from './config/connectDb';
import initScronJob from './scheduler';
import configScronJob from './config/scronJob';
// import logEvent from './helpers/log';
import connectRedis from './config/connectRedis';
import routeMain from './routes/index.router';
import logger from './config/winston';

dotenv.config();
const app = express();
const PORT = process.env.DEV_SERVER_PORT || 8000;

configViewEngine(app);
connectDb();
connectRedis();
initScronJob(configScronJob);

app.use(helmet());
app.use(express.json());
app.use(cors());
// app.use(morgan('combined', { stream: winston.stream }));

routeMain(app);

app.use((req, res, next) => {
    next(createError.NotFound('This router not found'));
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // logEvent(`${req.url}--${req.method}--${uuid()}--${err.message}`);
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // add this line to include winston logging
    logger.error(`${req.url}--${req.method}--${uuid()}--${err.message}`);
    res.status(err.status || 500).json({
        message: err.message
    });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
