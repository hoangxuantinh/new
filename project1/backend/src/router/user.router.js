import express from 'express';
const route = express.Router();
import * as authController from '../controller/authController';

route.post('/login', authController.login);
route.post('/register', authController.register);

export default route;
