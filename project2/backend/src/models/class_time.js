const {
    Model
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    class ClassTime extends Model {
        // eslint-disable-next-line no-unused-vars
        static associate(models) {
            ClassTime.belongsTo(models.Class, {
                foreignKey: 'classId'
            });
            ClassTime.belongsTo(models.Times, {
                foreignKey: 'timeId'
            });
            ClassTime.belongsTo(models.DayOfWeek, {
                foreignKey: 'dayId'
            });
        }
    }
    ClassTime.init({
        timeId: DataTypes.INTEGER,
        classId: DataTypes.INTEGER,
        dayId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ClassTime'
    });
    return ClassTime;
};
