'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        fullname: 'Xuan Tinh',
        email: 'example@example.com',
        password: '$2a$10$9nYoYnatcK.jvwoW1Rf9UONmyQnBoRIzWmqd8YKHgrowYc/dLwPlG',
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
