/* eslint-disable no-undef */
import queryString from 'query-string';
import userApi from '../apiTest/userApi';
import db from '../models/index';
import createResponseCommon from '../ultils/createResponseCommon';
import { initDataInvalid, initDataUserInAdmin } from './initData/initData';
import { seedAdminAndStorgeConfig } from './initData/seeder';
import handleDeleteFile from '../ultils/removeFile';

const callApiEditUser = async (dataEdit, config) => {
    const formData = initDataInvalid(dataEdit);
    const user = await db.User.findOne({
        where: {
            email: 'hxt284999@gmail.com'
        }
    });
    return createResponseCommon(userApi.edit({ id: user.id, formData }, config));
};

const callApiAddUser = async (initData, config) => {
    const formData = initDataInvalid(initData);
    return createResponseCommon(userApi.add(formData, config));
};

const findUserAndDeleteAvatar = async () => {
    const user = await db.User.findOne({
        where: {
            email: 'hxt284999@gmail.com'
        },
        raw: true
    });
    handleDeleteFile(user.avatar);
};

describe('Api Create User For Admin', () => {
    let config = null;
    let initData = {};
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    test('Create New User Success', async () => {
        const formData = initDataUserInAdmin();
        const res = await createResponseCommon(userApi.add(formData, config));
        await findUserAndDeleteAvatar();
        expect(res.data).toEqual({
            status: true
        });
    });

    test('Create New User Conflict', async () => {
        const formData = initDataUserInAdmin();
        const res = await createResponseCommon(userApi.add(formData, config));
        expect(res.status).toEqual(409);
        expect(res.data.message).toEqual('hxt284999@gmail.com has already exist!');
    });

    test('Add User With Error Fullname Is Required', async () => {
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"fullname" is required');
    });

    test('Add User With Error Password Is Required', async () => {
        initData = {
            fullname: 'hoang xuan tinh'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"password" is required');
    });

    test('Add User With Error email Is Required', async () => {
        initData = {
            ...initData,
            password: '123456tT'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"email" is required');
    });

    test('Add User Invalid format Email', async () => {
        initData = {
            ...initData,
            email: 'hxt@.com'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"email" must be a valid email');
    });

    test('Add User With Error gender Is Required', async () => {
        initData = {
            ...initData,
            email: 'hxt@gmail.com',
            password: '123456tT'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"gender" is required');
    });

    test('Add User With Error address Is Required', async () => {
        initData = {
            ...initData,
            gender: 'male'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"address" is required');
    });

    test('Add User With Error phone Is Required', async () => {
        initData = {
            ...initData,
            address: 'nghe an'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"phone" is required');
    });

    test('Add User With Error role Is Required', async () => {
        initData = {
            ...initData,
            phone: '0974912705'
        };
        const res = await callApiAddUser(initData, config);
        expect(res.data.message).toEqual('"role" is required');
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});

describe('Api Edit User For Admin', () => {
    let config = null;
    let initData = {};

    beforeAll(async () => {
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    test('Create New User Success', async () => {
        const formData = initDataUserInAdmin();
        const res = await createResponseCommon(userApi.add(formData, config));
        await findUserAndDeleteAvatar();
        expect(res.data).toEqual({
            status: true
        });
    });

    test('Get All User', async () => {
        const filter = {
            page: 1,
            limit: 3
        };
        const params = queryString.stringify(filter);
        const res = await createResponseCommon(userApi.getAll(params, config));
        expect(res.data.records).toBeTruthy();
        expect(res.data.pagination).toBeTruthy();
        expect(res.data.pagination.total).toEqual(2);
    });

    test('Edit User With Error Fullname is Required', async () => {
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"fullname" is required');
    });

    test('Edit User With Error email is Required', async () => {
        initData = {
            fullname: 'hoang xuan tinh'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"email" is required');
    });

    test('Edit User With Error email Must Be Email', async () => {
        initData = {
            ...initData,
            email: 'hxt@.com'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"email" must be a valid email');
    });

    test('Edit User With Error gender is Required', async () => {
        initData = {
            ...initData,
            email: 'hxt@gmail.com'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"gender" is required');
    });

    test('Edit User With Error address is Required', async () => {
        initData = {
            ...initData,
            gender: 'male'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"address" is required');
    });

    test('Edit User With Error phone is Required', async () => {
        initData = {
            ...initData,
            address: 'nghe an'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"phone" is required');
    });

    test('Edit User With Error role is Required', async () => {
        initData = {
            ...initData,
            phone: '0974912705'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data.message).toEqual('"role" is required');
    });

    test('Edit User Success', async () => {
        initData = {
            ...initData,
            role: 'user'
        };
        const res = await callApiEditUser(initData, config);
        expect(res.data).toEqual({
            status: true
        });
    });
});

describe('Api Delete User For Admin', () => {
    let config = null;
    beforeAll(async () => {
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    test('Create New User Success', async () => {
        const formData = initDataUserInAdmin();
        const res = await createResponseCommon(userApi.add(formData, config));
        expect(res.data).toEqual({
            status: true
        });
    });

    test('Delete User Success', async () => {
        const user = await db.User.findOne({
            where: {
                email: 'hxt284999@gmail.com'
            }
        });
        const { id } = user;
        const res = await createResponseCommon(userApi.remove(id, config));
        const userDeleted = await db.User.findOne({
            where: {
                id
            }
        });
        expect(userDeleted).toBeFalsy();
        expect(res.data).toEqual({
            status: true
        });
    });
    afterAll(async () => {
        await db.User.sequelize.sync({ force: true });
    });
});

describe('Get User By ID', () => {
    let config = null;
    beforeAll(async () => {
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    test('Get User By Id Success', async () => {
        const user = await db.User.findOne({
            where: {
                email: 'hxt28499@gmail.com'
            }
        });
        const res = await createResponseCommon(userApi.detail(user.id, config));
        expect(res.data.user).toBeTruthy();
        expect(res.data.user.email).toEqual('hxt28499@gmail.com');
    });
});

describe('Get Gender And Role Features', () => {
    test('Get Gender And Role Features SC', async () => {
        const res = await createResponseCommon(userApi.getProperty());
        expect(res.data.roles).toBeTruthy();
        expect(res.data.genders).toBeTruthy();
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});
