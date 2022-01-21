import appRoot from 'app-root-path';
import express from 'express';

const configViewEngine = (app) => {
    app.set('views', `${appRoot}/src/views`);
    app.set('view engine', 'ejs');
    app.use(express.static(`${appRoot}/public`));
};
export default configViewEngine;
