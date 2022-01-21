import dotenv from 'dotenv';
import express from 'express';
import createError from 'http-errors';
import { v4 as uuid } from 'uuid';
import helmet from 'helmet';
import cors from 'cors';
import configViewEngine from './config/configViewEngine';
import connectDb from './config/connectDb';
import initScronJob from './scheduler';
import configScronJob from './config/scronJob';
import logEvent from './helpers/log';
import connectRedis from './config/connectRedis';
import routeMain from './routes/index.router';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

configViewEngine(app);
connectDb();
connectRedis();
initScronJob(configScronJob);

app.use(helmet());
app.use(express.json());
app.use(cors());

routeMain(app);

app.use((req, res, next) => {
    next(createError.NotFound('This router not found'));
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    logEvent(`${req.url}--${req.method}--${uuid()}--${err.message}`);
    res.status(err.status || 500).json({
        message: err.message
    });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
