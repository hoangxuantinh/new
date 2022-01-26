// /* eslint-disable no-undef */
// import queryString from 'query-string';
// import registerApi from '../apiTest/registerApi';
// import { SeederAdminAndCreateClass } from './initData/seeder';
// import createResponseCommon from '../ultils/createResponseCommon';
// import { findClassByName } from './class.admin.test';
// import db from '../models/index';

// describe('Api Get Register For Admin ', () => {
//     let config = null;
//     let classId = null;
//     beforeAll(async () => {
//         const res = await SeederAdminAndCreateClass();
//         config = res;
//     });
//     it('User Registation Success', async () => {
//         const user = await db.User.findOne({
//             name: 'hxt28499@gmail.com'
//         });
//         let classCreated = await findClassByName('JavaScript Cơ Bản');
//         classId = classCreated.id;
//         const data = { userId: user.id, classId: classCreated.id };
//         const res = await createResponseCommon(registerApi.add(data, config));
//         const register = await db.Register.findOne({
//             where: {
//                 classId: classCreated.id
//             }
//         });
//         classCreated = await findClassByName('JavaScript Cơ Bản');
//         const count = await db.Register.count();
//         expect(res.data).toEqual({ status: true });
//         expect(count).toEqual(1);
//         expect(register.status).toEqual('pending');
//         expect(classCreated.currentNumber).toEqual(1);
//     });

//     it('Get All Register', async () => {
//         const res = await createResponseCommon(registerApi.getAll(config));
//         const result = res.data.data;
//         expect(result).toBeTruthy();
//         expect(result[0].email).toEqual('hxt28499@gmail.com');
//     });
// });

// describe('Api Confirm Register', () => {
//     let config = null;
//     let classId = null;
//     let userId = null;
//     beforeAll(async () => {
//         const res = await SeederAdminAndCreateClass();
//         config = res;
//     });
//     it('User Registation Success', async () => {
//         const user = await db.User.findOne({
//             name: 'hxt28499@gmail.com'
//         });
//         userId = user.id;
//         let classCreated = await findClassByName('JavaScript Cơ Bản');
//         classId = classCreated.id;
//         const data = { userId: user.id, classId: classCreated.id };
//         const res = await createResponseCommon(registerApi.add(data, config));
//         const register = await db.Register.findOne({
//             where: {
//                 classId: classCreated.id
//             }
//         });
//         classCreated = await findClassByName('JavaScript Cơ Bản');
//         const count = await db.Register.count();
//         expect(res.data).toEqual({ status: true });
//         expect(count).toEqual(1);
//         expect(register.status).toEqual('pending');
//         expect(classCreated.currentNumber).toEqual(1);
//     });

//     it('Confirm Register', async () => {
//         const dataConfirm = {
//             userId,
//             classId
//         };
//         const res = await createResponseCommon(registerApi.confirmed(dataConfirm, config));
//         const register = await db.Register.findOne({
//             where: {
//                 classId,
//                 userId
//             },
//             raw: true
//         });
//         expect(res.data).toEqual({ status: true });
//         expect(register.status).toEqual('confirm');
//     });
// });
// describe('Api Cancel Register For Admin', () => {
//     let config = null;
//     let classId = null;
//     let userId;
//     beforeAll(async () => {
//         await db.sequelize.sync({ force: true });
//         const res = await SeederAdminAndCreateClass();
//         config = res;
//     });
//     it('User Registation Success', async () => {
//         const user = await db.User.findOne({
//             name: 'hxt28499@gmail.com'
//         });
//         userId = user.id;
//         let classCreated = await findClassByName('JavaScript Cơ Bản');
//         classId = classCreated.id;
//         const data = { userId: user.id, classId: classCreated.id };
//         const res = await createResponseCommon(registerApi.add(data, config));
//         const register = await db.Register.findOne({
//             where: {
//                 classId: classCreated.id
//             }
//         });
//         classCreated = await findClassByName('JavaScript Cơ Bản');
//         const count = await db.Register.count();
//         expect(res.data).toEqual({ status: true });
//         expect(count).toEqual(1);
//         expect(register.status).toEqual('pending');
//         expect(classCreated.currentNumber).toEqual(1);
//     });

//     it('Cancel Register Success', async () => {
//         const dataConfirm = {
//             userId,
//             classId
//         };
//         const res = await createResponseCommon(registerApi.removeInAdmin(dataConfirm, config));
//         const register = await db.Register.findOne({
//             where: {
//                 classId,
//                 userId
//             },
//             raw: true
//         });
//         const currentClass = await db.Class.findOne({
//             where: {
//                 id: classId
//             },
//             raw: true
//         });
//         expect(res.data).toEqual({ status: true });
//         expect(currentClass.currentNumber).toEqual(0);
//         expect(register).toBeFalsy();
//     });
//     afterAll(async () => {
//         await db.sequelize.sync({ force: true });
//     });
// });

// describe('Search And Filter Register', () => {
//     let config = null;
//     let userId = null;
//     const filter = {
//         limit: 4,
//         page: 1,
//         status: '',
//         search: ''
//     };
//     beforeAll(async () => {
//         await db.sequelize.sync({ force: true });
//         const res = await SeederAdminAndCreateClass();
//         config = res;
//     });
//     it('User Registation Success', async () => {
//         const user = await db.User.findOne({
//             name: 'hxt28499@gmail.com'
//         });
//         userId = user.id;
//         let classCreated = await findClassByName('JavaScript Cơ Bản');
//         const data = { userId: user.id, classId: classCreated.id };
//         const res = await createResponseCommon(registerApi.add(data, config));
//         const register = await db.Register.findOne({
//             where: {
//                 classId: classCreated.id
//             }
//         });
//         classCreated = await findClassByName('JavaScript Cơ Bản');
//         const count = await db.Register.count();
//         expect(res.data).toEqual({ status: true });
//         expect(count).toEqual(1);
//         expect(register.status).toEqual('pending');
//         expect(classCreated.currentNumber).toEqual(1);
//     });

//     it('Search Register With No Status and Search', async () => {
//         const params = queryString.stringify(filter);
//         const res = await createResponseCommon(registerApi.search(params, config));
//         expect(res.data.records).toBeTruthy();
//         expect(res.data.records.length).toEqual(1);
//         expect(res.data.pagination).toBeTruthy();
//     });

//     it('Search Register With Status Confirm', async () => {
//         const params = queryString.stringify({ ...filter, status: 'confirm' });
//         const res = await createResponseCommon(registerApi.search(params, config));
//         expect(res.data.records).toBeTruthy();
//         expect(res.data.records.length).toEqual(0);
//         expect(res.data.pagination).toBeTruthy();
//     });

//     it('Search Register With Status Pending', async () => {
//         const params = queryString.stringify({ ...filter, status: 'pending' });
//         const res = await createResponseCommon(registerApi.search(params, config));
//         expect(res.data.records).toBeTruthy();
//         expect(res.data.records.length).toEqual(1);
//         expect(res.data.pagination).toBeTruthy();
//     });
//     afterAll(async () => {
//         await db.sequelize.sync({ force: true });
//     });
// });
