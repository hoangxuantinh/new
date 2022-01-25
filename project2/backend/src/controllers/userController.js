/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import createError from 'http-errors';
import handleDeteleFile from '../ultils/removeFile';
import db from '../models/index';
import { hashPassword } from '../ultils/bcryptjs';
import { validateInforUser, validateInforUserUpdate } from '../validations/user.validate';

export const getUser = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 7;
        const offset = +(page - 1) * limit;
        const users = await db.User.findAndCountAll({
            attributes: [
                'id',
                'fullname',
                'email',
                'avatar',
                'gender',
                'phone',
                'address',
                'phone',
                'role'
            ],
            limit: +limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        if (!users) {
            throw createError.NotFound();
        }
        res.json({
            records: users,
            pagination: {
                limit: +limit,
                page: +page,
                total: users.count
            }
        });
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req, res, next) => {
    try {
        const fileInServer = req.file.filename;
        const { user } = req.body;
        const dataPlain = JSON.parse(user);
        const { error } = validateInforUser(dataPlain);
        if (error) {
            handleDeteleFile(fileInServer);
            throw createError(error.details[0].message);
        }
        const {
            fullname, password, email, address, phone, gender, role
        } = dataPlain;

        const checkUserIsExit = await db.User.findOne({
            where: {
                email
            }
        });
        if (checkUserIsExit) {
            console.log('đã tồn tại');
            throw createError.Conflict(`${email} has already exist!`);
        }
        const passwordInServer = await hashPassword(password);

        await db.User.create({
            fullname,
            email,
            password: passwordInServer,
            address,
            phone,
            gender,
            role,
            avatar: fileInServer
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const getFeatuters = async (req, res, next) => {
    try {
        const genders = await db.User.rawAttributes.gender.values;
        const roles = await db.User.rawAttributes.role.values;
        res.json({
            genders,
            roles
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await db.User.findOne({
            where: {
                id
            }
        });
        if (!user) {
            throw createError.NotFound('Users Not Found');
        }
        if (user.avatar) {
            handleDeteleFile(user.avatar);
        }
        await db.User.destroy({
            where: {
                id
            }
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await db.User.findOne({
            where: {
                id
            },
            raw: true
        });
        if (!user) {
            throw createError.NotFound('User not Found');
        }
        delete user.password;
        res.send({
            user
        });
    } catch (error) {
        next(error);
    }
};

export const editUser = async (req, res, next) => {
    try {
        const fileInServer = req.file?.filename || null;
        const { user } = req.body;
        const dataPlain = JSON.parse(user);
        const {
            fullname, phone, gender, role, address, email
        } = dataPlain;
        const { error } = validateInforUserUpdate(dataPlain);

        if (error) {
            throw createError(error.details[0].message);
        }
        const checkUserExist = await db.User.findOne({
            where: {
                email
            }
        });

        await db.User.update({
            fullname,
            phone,
            address,
            gender,
            role,
            avatar: fileInServer || checkUserExist.avatar
        }, {
            where: {
                email
            }
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const getUserByClassId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await db.User.findAll({
            attributes: ['id', 'email', 'fullname', 'phone', 'address'],
            as: 'user',
            include: [
                {
                    model: db.Class,
                    attributes: ['name', 'id'],
                    required: true,
                    through: [],
                    include: [
                        {
                            model: db.Register,
                            attributes: ['status'],
                            required: true,
                            on: {
                                col1: db.sequelize.where(db.sequelize.col('Classes.Registers.userId'), '=', db.sequelize.col('User.id')),
                                col2: db.sequelize.where(db.sequelize.col('Classes.Registers.classId'), '=', db.sequelize.col('Classes.id'))
                            }
                        }
                    ]
                }

            ],
            where: {
                '$Classes.id$': id
            },
            raw: true,
            nest: true
        });
        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
};
