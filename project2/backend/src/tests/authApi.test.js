/* eslint-disable no-undef */
import authApi from '../apiTest/authApi';
import { initDataUser, initDataInvalid, initDataInvalidForChangeProfile } from './initData/initData';
import createResponseCommon from '../ultils/createResponseCommon';
import db from '../models/index';
import { seedAdminAndStorgeConfig } from './initData/seeder';
import handleDeleteFile from '../ultils/removeFile';

const callApiRegister = async (initData) => {
    const formData = initDataInvalid(initData);
    return createResponseCommon(authApi.register(formData));
};

describe('Api Auth Register', () => {
    let user = {};
    beforeAll(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    test('User Register Success', async () => {
        const formData = initDataUser();
        const res = await authApi.register(formData);
        handleDeleteFile(res.data.user.avatar);
        expect(res.data.user.avatar).toBeTruthy();
        expect(res.data.access_token).toBeTruthy();
        expect(res.data.refresh_token).toBeTruthy();
        expect(res.data.user.email).toEqual('hxt28499@gmail.com');
    });

    test('User Register With Error Fullname is Required', async () => {
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"fullname" is required');
    });

    test('User Register With Error Password is Required', async () => {
        user = {
            fullname: 'xuantinh'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"password" is required');
    });

    test('User Register With Error password is Required', async () => {
        user = {
            ...user,
            email: 'hxt2849@gmail.com'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"password" is required');
    });

    test('User Register With Error retypePassword is Required', async () => {
        user = {
            ...user,
            password: '123456tT'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"retypePassword" is required');
    });

    test('User Register Is Not Match Password', async () => {
        user = {
            ...user,
            retypePassword: '12345'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('retypePassword Invalid');
    });

    test('User Register with error Phone is Required', async () => {
        user = {
            ...user,
            password: '123456tT',
            retypePassword: '123456tT'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"phone" is required');
    });

    test('User Register Invalid Format Email', async () => {
        user = {
            ...user,
            email: 'hxt@com'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"email" must be a valid email');
    });

    test('User Register with Error gender is Required', async () => {
        user = {
            ...user,
            email: 'hxt2849@gmail.com',
            phone: '0327403079'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"gender" is required');
    });

    test('User Register with Error address is Required', async () => {
        user = {
            ...user,
            gender: 'male'
        };
        const res = await callApiRegister(user);
        expect(res.data.message).toEqual('"address" is required');
    });

    test('User Register Conflict', async () => {
        const formData = initDataUser();
        const res = await createResponseCommon(authApi.register(formData));
        expect(res.status).toEqual(409);
        expect(res.data.message).toEqual('hxt28499@gmail.com has already exist');
    });
});

describe('User Verify Email When Register ready', () => {
    beforeAll(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    let tokenEmail = null;

    beforeEach(async () => {
        const formData = initDataUser();
        const res = await authApi.register(formData);
        const { user } = res.data;
        handleDeleteFile(user.avatar);
        tokenEmail = { id: user.id, token: user.tokenEmail };
    });
    afterEach(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    it('User Register Verify Fail Not Found', async () => {
        const res = await createResponseCommon(authApi.registerConfirm({ ...tokenEmail, id: 2 }));
        expect(res.status).toEqual(404);
        expect(res.data.message).toEqual('User Not Found');
    });

    it('User Register Verify Fail Wrong Token Email', async () => {
        const res = await createResponseCommon(authApi.registerConfirm({ token: 'abcdes', id: 1 }));
        expect(res.status).toEqual(401);
        expect(res.data.message).toEqual('Token Invalid');
    });
    it('User Register Verify Success', async () => {
        const res = await createResponseCommon(authApi.registerConfirm(tokenEmail));
        expect(res.data).toEqual({
            status: true
        });
    });
});

describe('User Login But Not verify', () => {
    beforeAll(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    beforeEach(async () => {
        const formData = initDataUser();
        const res = await authApi.register(formData);
        const { user } = res.data;
        handleDeleteFile(user.avatar);
    });
    afterEach(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    it('Login Fail Since not Verify', async () => {
        const res = await createResponseCommon(authApi.login({
            email: 'hxt28499@gmail.com',
            password: '123456tT'
        }));
        expect(res.status).toEqual(401);
        expect(res.data.message).toEqual('Your account has not been confirmed email!');
    });
});

describe('User Login after verify', () => {
    let tokenEmail = {};
    beforeAll(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    beforeEach(async () => {
        const formData = initDataUser();
        const res = await authApi.register(formData);
        const { user } = res.data;
        handleDeleteFile(user.avatar);
        tokenEmail = { id: user.id, token: user.tokenEmail };
        await authApi.registerConfirm(tokenEmail);
    });
    afterEach(async () => {
        await db.User.sequelize.sync({ force: true });
    });
    it('User login Fail Email Not Exist', async () => {
        const userInfor = {
            email: 'tubl@gmail.com',
            password: '123456tT'
        };
        const res = await createResponseCommon(authApi.login(userInfor));
        expect(res.data.message).toEqual('tubl@gmail.com isn\'t exist');
        expect(res.status).toEqual(404);
    });

    it('User login Fail Wrong Password', async () => {
        const userInfor = {
            email: 'hxt28499@gmail.com',
            password: 'abcdef'
        };
        const res = await createResponseCommon(authApi.login(userInfor));
        expect(res.data.message).toEqual('password not valid');
        expect(res.status).toEqual(401);
    });

    it('User login Success', async () => {
        const userInfor = {
            email: 'hxt28499@gmail.com',
            password: '123456tT'
        };
        const res = await createResponseCommon(authApi.login(userInfor));
        expect(res.data.access_token).toBeTruthy();
        expect(res.data.refresh_token).toBeTruthy();
        expect(res.data.user).toBeTruthy();
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});

describe('User Change Password', () => {
    let config = null;
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    it('User Change Password But Invalid Old Password', async () => {
        const passwordInfor = {
            password: 'abcdefgh',
            newPassword: '1234567tT'
        };
        const res = await createResponseCommon(authApi.changePassword(passwordInfor, config));
        expect(res.status).toEqual(401);
        expect(res.data.message).toEqual('Old Password not valid');
    });
    it('User Change Password Success', async () => {
        const passwordInfor = {
            password: '123456tT',
            newPassword: '1234567tT'
        };
        const resChangePassword = await authApi.changePassword(passwordInfor, config);
        expect(resChangePassword.data).toEqual({
            status: true
        });
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});

describe('User Change Profile', () => {
    let config = null;
    let initData = {};
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    it('User Change Profile With Error FullName is Required', async () => {
        const formData = initDataInvalidForChangeProfile(initData);
        const res = await createResponseCommon(authApi.changeProfile(formData, config));
        expect(res.data.message).toEqual('"fullname" is required');
    });
    it('User Change Profile With Error Phone is Required', async () => {
        initData = {
            fullname: 'Tu Dep Trai'
        };
        const formData = initDataInvalidForChangeProfile(initData);
        const res = await createResponseCommon(authApi.changeProfile(formData, config));
        expect(res.data.message).toEqual('"phone" is required');
    });
    it('User Change Profile With Error Gender is Required', async () => {
        initData = {
            ...initData,
            phone: '0327403079'
        };
        const formData = initDataInvalidForChangeProfile(initData);
        const res = await createResponseCommon(authApi.changeProfile(formData, config));
        expect(res.data.message).toEqual('"gender" is required');
    });
    it('User Change Profile With Error Address is Required', async () => {
        initData = {
            ...initData,
            gender: 'male'
        };
        const formData = initDataInvalidForChangeProfile(initData);
        const res = await createResponseCommon(authApi.changeProfile(formData, config));
        expect(res.data.message).toEqual('"address" is required');
    });
    it('User Change Profile With Error Role is Required', async () => {
        initData = {
            ...initData,
            address: 'nghe an'
        };
        const formData = initDataInvalidForChangeProfile(initData);
        const res = await createResponseCommon(authApi.changeProfile(formData, config));
        expect(res.data.message).toEqual('"role" is required');
    });

    it('User Change Profile Success', async () => {
        initData = {
            ...initData,
            role: 'admin'
        };
        const formData = initDataInvalidForChangeProfile(initData);
        const res = await createResponseCommon(authApi.changeProfile(formData, config));
        handleDeleteFile(res.data.userInfor.avatar);
        expect(res.data.status).toBeTruthy();
        expect(res.data.userInfor).toBeTruthy();
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});

describe('User Get Profile And Logout ', () => {
    let config = null;
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });

    it('User get Profile Success ', async () => {
        const profile = await createResponseCommon(authApi.getLogin(config));
        expect(profile.data.user).toBeTruthy();
        expect(profile.data.user.email).toEqual('hxt28499@gmail.com');
    });
    it('Logout', async () => {
        const res = await createResponseCommon(authApi.logout(config));
        expect(res.data).toEqual({
            status: true
        });
    });

    it('Get Profile Fail', async () => {
        config = {
            ...config,
            Authorization: 'Bearer jhjsdhfjhsjdfhsuiufoisudfkjdskf'
        };
        const profile = await createResponseCommon(authApi.getLogin(config));
        expect(profile.status).toEqual(401);
        expect(profile.data.message).toEqual('Unauthorized');
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});
