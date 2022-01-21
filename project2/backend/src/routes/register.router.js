import express from 'express';
import * as registerController from '../controllers/registerController';
import { URL } from '../constants/url';
import { middleWareVerify } from '../middleware/verifyToken';
import { middleWareAuthor } from '../middleware/author';

const route = express.Router();
const registerRouter = (app) => {
    route.get('/', middleWareVerify, registerController.getAll);
    route.get('/filter', middleWareVerify, registerController.searchRegisters);
    route.post('/confirmed', middleWareVerify, middleWareAuthor, registerController.confirmRegister);
    route.delete('/', middleWareVerify, middleWareAuthor, registerController.cancelInAdmin);
    // cancel client
    route.post('/', middleWareVerify, registerController.add);
    route.delete('/client', middleWareVerify, registerController.removeCourse);
    route.get('/check', middleWareVerify, registerController.checkIsRegister);
    route.get('/:id', middleWareVerify, registerController.getCourseByUserId);

    return app.use(`${URL}/registation/`, route);
};

export default registerRouter;
