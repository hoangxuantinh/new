/* eslint-disable no-unused-vars */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DayOfWeeks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            index: {
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('DayOfWeeks');
    }
};
