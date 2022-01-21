import express from 'express';
import * as userController from '../controllers/userController';
import { upload } from '../middleware/uploadFile';
import { URL } from '../constants/url';
import { middleWareVerify } from '../middleware/verifyToken';
import { middleWareAuthor } from '../middleware/author';

const route = express.Router();

const userRouter = (app) => {
    route.get('/', middleWareVerify, userController.getUser);
    route.get('/class/:id', middleWareVerify, userController.getUserByClassId);
    route.get('/featutes', userController.getFeatuters);
    route.post('/', middleWareVerify, middleWareAuthor, upload.single('avatar'), userController.addUser);
    route.put('/:id', middleWareVerify, middleWareAuthor, upload.single('avatar'), userController.editUser);
    route.delete('/:id', middleWareVerify, middleWareAuthor, userController.deleteUser);
    route.get('/:id', middleWareVerify, userController.getUserById);
    return app.use(`${URL}/users/`, route);
};

export default userRouter;
