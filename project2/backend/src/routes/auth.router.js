import express from 'express';
import * as authController from '../controllers/authController';
import { URL } from '../constants/url';
import { middleWareVerify } from '../middleware/verifyToken';
import { upload } from '../middleware/uploadFile';

const route = express.Router();
const authRouter = (app) => {
    route.post('/login', authController.login);
    route.get('/get-login', middleWareVerify, authController.getProfile);
    route.post('/register', upload.single('avatar'), authController.register);
    route.post('/register/verify-email', authController.confirmEmail);
    route.post('/refresh-token', authController.refreshToken);
    route.delete('/logout', middleWareVerify, authController.logout);
    route.post('/change-password', middleWareVerify, authController.changePassword);
    route.post('/change-profile', upload.single('avatar'), middleWareVerify, authController.changeProfile);

    return app.use(`${URL}/auth/`, route);
};

export default authRouter;
