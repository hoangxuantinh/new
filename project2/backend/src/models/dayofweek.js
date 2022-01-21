/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DayOfWeek extends Model {
        // eslint-disable-next-line no-unused-vars
        static associate(models) {
            DayOfWeek.belongsToMany(models.Class, { through: models.ClassTime, foreignKey: 'dayId' });
            DayOfWeek.belongsToMany(models.Times, { through: models.ClassTime, foreignKey: 'dayId' });
            DayOfWeek.hasMany(models.ClassTime, { foreignKey: 'dayId' });
        }
    }
    DayOfWeek.init({
        index: DataTypes.INTEGER,
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'DayOfWeek'
    });
    return DayOfWeek;
};
