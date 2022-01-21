const {
    Model
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserClass extends Model {
        // eslint-disable-next-line no-unused-vars
        static associate(models) {
            UserClass.belongsTo(models.Class, { foreignKey: 'classId' });
            UserClass.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    UserClass.init({
        userId: DataTypes.INTEGER,
        classId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'UserClass'
    });
    return UserClass;
};
