import express from 'express';
import connectDb from './config/connectDb';
import cors from 'cors';
import configViewEngine from './config/configViewEngine';
import createError from 'http-errors';
import userRouter from './router/User.router';

const app = express();

app.use(cors());
require('dotenv').config();
configViewEngine(app);
// config data json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  next(createError.NotFound(`This Route isn't exist`));
});

app.use((err, req, res, next) => {
  res.send({
    status: err.status || 400,
    message: err.message,
  });
});

connectDb();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server up and running in Port ${PORT}`);
});
