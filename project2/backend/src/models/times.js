const {
    Model
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Times extends Model {
        static associate(models) {
            Times.belongsToMany(models.DayOfWeek, { through: models.ClassTime, foreignKey: 'timeId' });
            Times.belongsToMany(models.Class, { through: models.ClassTime, foreignKey: 'timeId' });
            Times.hasMany(models.ClassTime, { foreignKey: 'timeId' });
        }
    }
    Times.init({
        timeStart: DataTypes.TIME,
        timeEnd: DataTypes.TIME
    }, {
        sequelize,
        modelName: 'Times'
    });
    return Times;
};
