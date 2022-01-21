import express from 'express';
import * as timeController from '../controllers/timeController';
import { URL } from '../constants/url';
import { middleWareVerify } from '../middleware/verifyToken';
import { middleWareAuthor } from '../middleware/author';

const route = express.Router();
const userRouter = (app) => {
    route.post('/', middleWareVerify, middleWareAuthor, timeController.create);
    route.delete('/:id', middleWareVerify, middleWareAuthor, timeController.deleteTime);
    route.put('/:id', middleWareVerify, middleWareAuthor, timeController.editTime);
    route.get('/', middleWareVerify, middleWareAuthor, timeController.getAll);
    route.get('/:id', middleWareVerify, timeController.getTimeById);

    return app.use(`${URL}/times/`, route);
};

export default userRouter;
