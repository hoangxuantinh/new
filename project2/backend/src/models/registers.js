const {
    Model
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Register extends Model {
        // eslint-disable-next-line no-unused-vars
        static associate(models) {
            Register.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
            Register.belongsTo(models.Class, { foreignKey: 'classId' });
        }
    }
    Register.init({
        userId: DataTypes.INTEGER,
        classId: DataTypes.INTEGER,
        description: DataTypes.STRING,
        status: DataTypes.ENUM('pending', 'confirm', 'cancel')
    }, {
        sequelize,
        modelName: 'Register'
    });
    return Register;
};
