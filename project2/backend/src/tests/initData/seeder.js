import db from '../../models/index';
import { initDataUser, initDataForCreatClass, initDataAdmin } from './initData';
import authApi from '../../apiTest/authApi';
import classApi from '../../apiTest/classApi';
import handleDeleteFile from '../../ultils/removeFile';
import { seedDayAndTime } from '../class.admin.test';

export const seedUserAndConfig = async () => {
    await db.User.sequelize.sync({ force: true });
    const formData = initDataUser();
    const res = await authApi.register(formData);
    const { user } = res.data;
    handleDeleteFile(user.avatar);
    const tokenEmail = { id: user.id, token: user.tokenEmail };
    await authApi.registerConfirm(tokenEmail);
    const resLogin = await authApi.login({ email: 'hxt28499@gmail.com', password: '123456tT' });
    const { access_token } = resLogin.data;
    const config = {
        Authorization: `Bearer ${access_token}`
    };
    return config;
};

export const SeederAdminAndCreateClass = async () => {
    await db.User.sequelize.sync({ force: true });
    const formData = initDataAdmin();
    const res = await authApi.register(formData);
    const { user } = res.data;
    handleDeleteFile(user.avatar);
    const tokenEmail = { id: user.id, token: user.tokenEmail };
    await authApi.registerConfirm(tokenEmail);
    const resLogin = await authApi.login({ email: 'hxt28499@gmail.com', password: '123456tT' });
    const { access_token } = resLogin.data;
    const config = {
        Authorization: `Bearer ${access_token}`
    };
    await seedDayAndTime();
    const formDataClass = initDataForCreatClass();
    await classApi.add(formDataClass, config);
    const newClass = await db.Class.findOne({
        where: {
            name: 'JavaScript Cơ Bản'
        },
        raw: true
    });
    handleDeleteFile(newClass.avatar);
    return config;
};

export const seedAdminAndStorgeConfig = async () => {
    await db.User.sequelize.sync({ force: true });
    const formData = initDataAdmin();
    const res = await authApi.register(formData);
    const { user } = res.data;
    const id = { user };
    handleDeleteFile(user.avatar);
    const tokenEmail = { id: user.id, token: user.tokenEmail };
    await authApi.registerConfirm(tokenEmail);
    const resLogin = await authApi.login({ email: 'hxt28499@gmail.com', password: '123456tT' });
    const { access_token } = resLogin.data;
    const config = {
        Authorization: `Bearer ${access_token}`
    };
    return {
        access_token,
        config,
        id
    };
};
