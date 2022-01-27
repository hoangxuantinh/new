/* eslint-disable no-undef */
/* eslint-disable import/no-cycle */

import classApi from '../apiTest/classApi';
import db from '../models/index';
import createResponseCommon from '../ultils/createResponseCommon';
import {
    initDataForCreatClass, initDataInvalidForCreateClass,
    initDataInvalidForEditClass, initDataForEditClass
} from './initData/initData';
import { seedAdminAndStorgeConfig, seedDayAndTime } from './initData/seeder';
import handleDeleteFile from '../ultils/removeFile';

export const findClassByName = async (name) => {
    const findOne = await db.Class.findOne(
        {
            where: {
                name
            }
        }
    );
    return findOne;
};

const callApiAddClass = async (initData, config) => {
    const formData = initDataInvalidForCreateClass(initData);
    return createResponseCommon(classApi.add(formData, config));
};

const callApiDeleteClass = async (config) => {
    const formData = initDataForCreatClass();
    await createResponseCommon(classApi.add(formData, config));
    let currentClass = await findClassByName('JavaScript Cơ Bản');
    const res = await createResponseCommon(classApi.remove(currentClass.id, config));
    currentClass = await findClassByName('JavaScript Cơ Bản');
    return {
        res,
        currentClass
    };
};

const callApiEditClass = async (initData, config) => {
    const formData = initDataInvalidForEditClass(initData);
    const { id } = await findClassByName('JavaScript Nâng Cao');
    return createResponseCommon(classApi.edit(id, formData, config));
};

//  add class
describe('Api Add Class for Admin', () => {
    let config = null;
    let initData = {};
    beforeAll(async () => {
        await db.Class.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        seedDayAndTime();
        config = res.config;
    });
    test('Create Class Success', async () => {
        const formData = initDataForCreatClass();
        const res = await createResponseCommon(classApi.add(formData, config));
        const newClass = await db.Class.findOne({
            where: {
                name: 'JavaScript Cơ Bản'
            }
        });
        handleDeleteFile(newClass.avatar);
        const classTime = await db.ClassTime.findOne({
            where: {
                classId: newClass.id
            }
        });
        expect(res.data).toEqual({
            status: true
        });
        expect(newClass).toBeTruthy();
        expect(classTime).toBeTruthy();
    });
    test('Create Class With Error Name class is required', async () => {
        const res = await callApiAddClass(initData, config);
        expect(res.data.message).toEqual('"name" is required');
    });

    test('Create Class With Error Description is required', async () => {
        initData = {
            name: 'Js cơ bản'
        };
        const res = await callApiAddClass(initData, config);
        expect(res.data.message).toEqual('"description" is required');
    });

    test('Create Class With Error Current Number is required', async () => {
        initData = {
            ...initData,
            description: 'học js'
        };
        const res = await callApiAddClass(initData, config);
        expect(res.data.message).toEqual('"currentNumber" is required');
    });

    test('Create Class With Error maxNumber is required', async () => {
        initData = {
            ...initData,
            currentNumber: 0
        };
        const res = await callApiAddClass(initData, config);
        expect(res.data.message).toEqual('"maxNumber" is required');
    });

    test('Create Class With Error Periods is required', async () => {
        initData = {
            ...initData,
            maxNumber: 5
        };
        const res = await callApiAddClass(initData, config);
        expect(res.data.message).toEqual('"periods" is required');
    });

    test('Create Class With Error maxNumber must Greate Current Number', async () => {
        initData = {
            ...initData,
            currentNumber: 8,
            maxNumber: 5
        };
        const res = await callApiAddClass(initData, config);
        expect(res.data.message).toEqual('"maxNumber" must be greater than or equal to ref:currentNumber');
    });
    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});

// Get Features
describe('Api Get Day of Week And Times', () => {
    let config = null;
    beforeAll(async () => {
        await db.Class.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        seedDayAndTime();
        config = res.config;
    });
    test('Get day and Time success', async () => {
        const res = await createResponseCommon(classApi.getFeatures(config));
        expect(res.data.dayOfWeeks).toBeTruthy();
        expect(res.data.timeList).toBeTruthy();
    });
});

delete
describe('Api Delete Class For Admin', () => {
    let config = null;
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        seedDayAndTime();
        config = res.config;
    });
    test('Delete Class Success', async () => {
        const handleDeleteClass = await callApiDeleteClass(config);
        expect(handleDeleteClass.res.data).toEqual({
            status: true
        });
        expect(handleDeleteClass.currentClass).toBeFalsy();
    });
});

// edit
describe('Api Edit Class for Admin', () => {
    let config = null;
    let initData = {};
    let currentClass = null;
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        const res = await seedAdminAndStorgeConfig();
        seedDayAndTime();
        config = res.config;
    });
    test('Create Class Success', async () => {
        const formData = initDataForCreatClass();
        const res = await createResponseCommon(classApi.add(formData, config));
        currentClass = await findClassByName('JavaScript Cơ Bản');
        handleDeleteFile(currentClass.avatar);
        expect(res.data).toEqual({ status: true });
        expect(currentClass).toBeTruthy();
    });

    test('Get One Class', async () => {
        const res = await createResponseCommon(classApi.getOne(currentClass.id, config));
        expect(res.data.data).toBeTruthy();
    });

    test('Edit Class Success', async () => {
        const formData = await initDataForEditClass();
        const res = await createResponseCommon(classApi.edit(currentClass.id, formData, config));
        const newClass = await findClassByName('JavaScript Nâng Cao');
        const oldClass = await findClassByName('JavaScript Cơ Bản');
        expect(res.data).toEqual({ status: true });
        expect(oldClass).toBeFalsy();
        expect(newClass).toBeTruthy();
    });

    test('Edit Class With Error Id is required', async () => {
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"id" is required');
    });

    test('Edit Class With Error Name Class is required', async () => {
        initData = {
            id: 1
        };
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"name" is required');
    });

    test('Edit Class With Error Description is required', async () => {
        initData = {
            ...initData,
            name: 'js cơ bản'
        };
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"description" is required');
    });

    test('Edit Class With Error Current Number is required', async () => {
        initData = {
            ...initData,
            description: 'học js cơ bản'
        };
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"currentNumber" is required');
    });

    test('Edit Class With Error Max Number is required', async () => {
        initData = {
            ...initData,
            currentNumber: 0
        };
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"maxNumber" is required');
    });

    test('Edit Class With Error MaxNumber Must Be Greater CurrentNumber', async () => {
        initData = {
            ...initData,
            currentNumber: 8,
            maxNumber: 4
        };
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"maxNumber" must be greater than or equal to ref:currentNumber');
    });

    test('Edit Class With Error Periods is required', async () => {
        initData = {
            ...initData,
            maxNumber: 8
        };
        const res = await callApiEditClass(initData, config);
        expect(res.data.message).toEqual('"periods" is required');
    });

    afterAll(async () => {
        await db.sequelize.sync({ force: true });
    });
});
