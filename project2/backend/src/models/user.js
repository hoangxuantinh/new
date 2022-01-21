const {
    Model
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('sequelize');
// import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        // eslint-disable-next-line no-unused-vars
        static associate(models) {
            User.hasMany(models.Register, { as: 'register', foreignKey: 'userId' });
            User.hasMany(models.UserClass, { foreignKey: 'userId' });
            User.belongsToMany(models.Class, { through: models.UserClass, foreignKey: 'userId' });
        }
    }
    User.init({

        fullname: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other')
        },
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        avatar: DataTypes.STRING,
        role: DataTypes.ENUM('admin', 'user'),
        isVerified: DataTypes.BOOLEAN,
        tokenEmail: DataTypes.STRING,
        timeVerify: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'User'
    });
    return User;
};
