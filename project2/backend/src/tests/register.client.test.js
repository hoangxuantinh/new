/* eslint-disable no-undef */
import registerApi from '../apiTest/registerApi';
import { SeederAdminAndCreateClass } from './initData/seeder';
import db from '../models/index';
import createResponseCommon from '../ultils/createResponseCommon';
import { findClassByName } from './class.admin.test';

describe('Api Add Regitser For User', () => {
    let config = null;
    let classId = null;
    beforeAll(async () => {
        const res = await SeederAdminAndCreateClass();
        config = res;
    });
    it('User Registation Success', async () => {
        const user = await db.User.findOne({
            name: 'hxt28499@gmail.com'
        });
        let classCreated = await findClassByName('JavaScript Cơ Bản');
        classId = classCreated.id;
        const data = { userId: user.id, classId: classCreated.id };
        const res = await createResponseCommon(registerApi.add(data, config));
        const register = await db.Register.findOne({
            where: {
                classId: classCreated.id
            }
        });
        classCreated = await findClassByName('JavaScript Cơ Bản');
        const count = await db.Register.count();
        expect(res.data).toEqual({ status: true });
        expect(count).toEqual(1);
        expect(register.status).toEqual('pending');
        expect(classCreated.currentNumber).toEqual(1);
    });

    it('User Registation Success And Check Is Register', async () => {
        const res = await createResponseCommon(registerApi.checkIsRegister(config));
        const result = res.data.data;
        expect(result).toBeTruthy();
        expect(result[0].id).toEqual(classId);
    });
    it('User Cancel Register', async () => {
        const res = await createResponseCommon(registerApi.remove(classId, config));
        expect(res.data).toEqual({ status: true });
    });
    it('User Registation With Error Class Not Found', async () => {
        const user = await db.User.findOne({
            name: 'hxt28499@gmail.com'
        });
        const data = { userId: user.id, classId: 2 };
        const res = await createResponseCommon(registerApi.add(data, config));

        expect(res.data.message).toEqual('Class Not Found');
    });
});
