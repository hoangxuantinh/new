import db from '../../models/index';
import { initDataUser, initDataForCreatClass, initDataAdmin } from './initData';
import authApi from '../../apiTest/authApi';
import classApi from '../../apiTest/classApi';
import { seedDayAndTime } from '../class.admin.test';

export const seedUserAndConfig = async () => {
    await db.User.sequelize.sync({ force: true });
    const formData = initDataUser();
    const res = await authApi.register(formData);
    const { user } = res.data;
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
    return config;
};
