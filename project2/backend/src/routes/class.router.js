import express from 'express';
import * as classController from '../controllers/classController';
import { upload } from '../middleware/uploadFile';
import { URL } from '../constants/url';
import { middleWareVerify } from '../middleware/verifyToken';
import { middleWareAuthor } from '../middleware/author';

const route = express.Router();
const userRouter = (app) => {
    route.get('/features', middleWareVerify, classController.getFeatures);
    route.get('/', classController.getAll);
    route.get('/all', classController.getAllForClient);
    route.post('/', middleWareVerify, middleWareAuthor, upload.single('avatar'), classController.addClass);
    route.get('/:id', classController.getClassById);
    route.put('/:id', middleWareVerify, middleWareAuthor, upload.single('avatar'), classController.updateClass);
    route.delete('/:id', middleWareVerify, middleWareAuthor, classController.deleteClass);

    return app.use(`${URL}/classes/`, route);
};
export default userRouter;
