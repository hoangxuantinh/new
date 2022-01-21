/* eslint-disable no-undef */
import timeApi from '../apiTest/timeApi';
import { seedUserAndConfig } from './initData/seeder';
import db from '../models/index';
import createResponseCommon from '../ultils/createResponseCommon';
import { seedAdminAndStorgeConfig } from './userApi.test';

describe('Api times for Admin', () => {
    let config = null;
    beforeAll(async () => {
        const res = await seedAdminAndStorgeConfig();
        config = res.config;
    });
    it('Api create new time', async () => {
        const initTime = {
            timeStart: '07:00',
            timeEnd: '09:00'
        };
        const res = await createResponseCommon(timeApi.add(initTime, config));
        expect(res.data).toEqual({ status: true });
    });

    it('Api Get Time By Id', async () => {
        const timeCreated = await db.Times.findOne({
            where: {
                timeStart: '07:00',
                timeEnd: '09:00'
            }
        });
        const res = await createResponseCommon(timeApi.getOne(timeCreated.id, config));
        expect(res.data.time).toBeTruthy();
    });

    it('Invalid Infor Create Time', async () => {
        const initTime = {
            timeEnd: '07:00'
        };
        const res = await createResponseCommon(timeApi.add(initTime, config));
        expect(res.status).toEqual(400);
        expect(res.data.message).toEqual('Time Infor not valid');
    });

    it('Get All ', async () => {
        const res = await createResponseCommon(timeApi.getAll(config));
        expect(res.data.times).toBeTruthy();
        expect(res.data.times[0]).toHaveProperty('timeStart');
        expect(res.data.times[0]).toHaveProperty('timeEnd');
    });

    it('Edit Time Not Found', async () => {
        const initTime = {
            id: 2,
            timeStart: '08:00',
            timeEnd: '10:00'
        };
        const res = await createResponseCommon(timeApi.edit(initTime, config));
        expect(res.status).toEqual(404);
        expect(res.data.message).toEqual('Time Not Found');
    });

    it('Edit Time Success', async () => {
        const time = await db.Times.findOne({
            where: {
                timeStart: '07:00',
                timeEnd: '09:00'
            }
        });
        const initTime = {
            id: time.id,
            timeStart: '08:00',
            timeEnd: '10:00'
        };
        const res = await createResponseCommon(timeApi.edit(initTime, config));
        expect(res.data).toEqual({
            status: true
        });
    });

    it('Delete Time', async () => {
        const time = await db.Times.findOne({
            where: {
                timeStart: '08:00',
                timeEnd: '10:00'
            }
        });
        const res = await createResponseCommon(timeApi.remove(time.id, config));
        expect(res.data).toEqual({
            status: true
        });
    });

    it('Delete Not Found Time', async () => {
        const id = 2;
        const res = await createResponseCommon(timeApi.remove(id, config));
        expect(res.status).toEqual(404);
        expect(res.data.message).toEqual('Time not found');
    });
});

describe('Api times for User', () => {
    let config = null;
    beforeAll(async () => {
        const res = await seedUserAndConfig();
        config = res.config;
    });
    it('Api create new time', async () => {
        const initTime = {
            timeStart: '07:00',
            timeEnd: '09:00'
        };
        const res = await createResponseCommon(timeApi.add(initTime, config));
        expect(res.status).toEqual(401);
        expect(res.data.message).toEqual('Unauthorized');
    });

    it('Edit Time Success', async () => {
        const initTime = {
            id: 1,
            timeStart: '08:00',
            timeEnd: '10:00'
        };
        const res = await createResponseCommon(timeApi.edit(initTime, config));
        expect(res.status).toEqual(401);
        expect(res.data.message).toEqual('Unauthorized');
    });
    it('Delete Time', async () => {
        const id = 1;
        const res = await createResponseCommon(timeApi.remove(id, config));
        expect(res.status).toEqual(401);
        expect(res.data.message).toEqual('Unauthorized');
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
});
