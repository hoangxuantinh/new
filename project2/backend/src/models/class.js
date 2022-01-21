const {
    Model
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        // eslint-disable-next-line no-unused-vars
        static associate(models) {
            Class.belongsToMany(models.Times, { through: models.ClassTime, foreignKey: 'classId' });
            Class.belongsToMany(models.DayOfWeek, { through: models.ClassTime, foreignKey: 'classId' });
            Class.hasMany(models.ClassTime, { foreignKey: 'classId' });
            Class.belongsToMany(models.User, { through: models.UserClass, foreignKey: 'classId' });
            Class.hasMany(models.UserClass, { foreignKey: 'classId' });
            Class.hasMany(models.Register, { foreignKey: 'classId' });
        }
    }
    Class.init({
        name: DataTypes.STRING,
        avatar: DataTypes.STRING,
        description: DataTypes.STRING,
        maxNumber: DataTypes.INTEGER,
        currentNumber: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Class'
    });
    return Class;
};
