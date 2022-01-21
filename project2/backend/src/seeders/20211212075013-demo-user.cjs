/* eslint-disable no-unused-expressions */
// eslint-disable-next-line import/no-import-module-exports
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');

module.exports = {
    // eslint-disable-next-line no-unused-vars
    up: async (queryInterface, Sequelize) => {
        const dummyJSON = [];
        for (let i = 0; i < 128; i++) {
            dummyJSON.push({
                fullname: faker.name.firstName(),
                email: faker.internet.email(),
                password: '$2a$10$DpItvXeef9uUlXianQa2IeDNbNB6Lmq86fEjm4TRiHF9hKTw2o8pi',
                phone: faker.phone.phoneNumber(),
                gender: 'Male',
                address: faker.address.streetAddress(),
                role: 'user',
                isVerified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await queryInterface.bulkInsert('Users', dummyJSON, {});
    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
