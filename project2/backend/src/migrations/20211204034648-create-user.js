module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fullname: {
                type: Sequelize.STRING
            },

            email: {
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.ENUM,
                values: ['Male', 'Female', 'Other']
            },
            address: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            role: {
                type: Sequelize.ENUM,
                values: ['admin', 'user']

            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                default: false
            },
            tokenEmail: {
                type: Sequelize.STRING
            },
            timeVerify: {
                type: Sequelize.DATE
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
        await queryInterface.dropTable('Users');
    }
};
