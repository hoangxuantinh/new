module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Registers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            classId: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.ENUM,
                values: ['pending', 'confirmed', 'cancel']
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
    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Registers');
    }
};
