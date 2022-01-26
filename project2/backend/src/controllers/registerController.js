/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import createError from 'http-errors';
import { Op } from 'sequelize';
import db from '../models/index';
import transporter from '../ultils/sendEmail';
import FILTER_PARAMS from '../constants/filterParams';
import CONSTANT_ADMIN from '../constants/constant';

export const add = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { userId, classId, description } = req.body;
        if (!userId || !classId) {
            throw createError.BadRequest();
        }
        const currentClass = await db.Class.findOne({
            where: {
                id: classId
            }
        });
        if (!currentClass) {
            throw createError.NotFound('Class Not Found');
        }

        await db.Register.create({
            userId,
            classId,
            description: description || '',
            status: CONSTANT_ADMIN.STATUS
        }, { transaction: t });
        await db.UserClass.create({
            userId,
            classId
        }, { transaction: t });

        currentClass.increment('currentNumber', { by: 1 }, { transaction: t });
        await t.commit();
        res.json({
            status: true
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const data = await db.User.findAll({
            attributes: ['fullname', 'email', 'phone', 'id', 'address'],
            as: 'user',
            include: [
                {
                    model: db.Register,
                    attributes: ['status'],
                    required: true,
                    as: 'register',
                    include: [{
                        model: db.Class,
                        attributes: ['name', 'id'],
                        required: true
                    }
                    ]
                }

            ],
            raw: true
        });
        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
};

export const getCourseByUserId = async (req, res, next) => {
    try {
        const { user } = req;
        const data = await db.User.findAll({
            attributes: ['fullname', 'email', 'address'],
            as: 'user',
            include: [
                {
                    model: db.Register,
                    attributes: ['status'],
                    required: true,
                    as: 'register',
                    include: [
                        {
                            model: db.Class,
                            attributes: ['name', 'avatar', 'id'],
                            required: true,
                            include: [
                                {
                                    model: db.ClassTime,
                                    attributes: ['id'],
                                    required: true,
                                    include: [
                                        {
                                            model: db.Times,
                                            attributes: ['timeStart', 'timeEnd'],
                                            required: true
                                        }, {

                                            model: db.DayOfWeek,
                                            attributes: ['id', 'name'],
                                            required: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                id: user.id
            }
        });
        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
};

export const removeCourse = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { user } = req;
        const { id } = req.query;
        const options = {
            where: {
                userId: user.id,
                classId: id
            }
        };
        const registerInfor = await db.Register.findOne(options);
        const userClass = await db.UserClass.findOne(options);
        const classInfor = await db.Class.findOne({
            where: {
                id
            }
        });

        if (!userClass) {
            throw createError.NotFound('UserClass Not Found');
        }
        if (!registerInfor) {
            throw createError.NotFound('Register Info Not Found');
        }
        if (!classInfor) {
            throw createError.NotFound('Class Not Found');
        }

        await Promise.all([
            await userClass.destroy(options, { transaction: t }),
            await registerInfor.destroy(options, { transaction: t })
        ]);
        if (classInfor.currentNumber > 0) {
            classInfor.decrement('currentNumber', { by: 1 }, { transaction: t });
            return res.json({
                status: true
            });
        }

        classInfor.update({
            currentNumber: 0
        }, { transaction: t });

        await t.commit();
        res.json({
            status: true
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const cancelInAdmin = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { userId, classId } = req.query;
        const options = {
            where: {
                userId,
                classId
            }

        };
        const currentRegister = await db.Register.findOne(options);
        const currentUserClass = await db.UserClass.findOne(options);
        const currentClass = await db.Class.findOne({
            where: {
                id: classId
            }
        });

        if (!currentRegister) {
            throw createError.NotFound('Register Info Not Found');
        }
        if (!currentUserClass) {
            throw createError.NotFound('UserClass Not Found');
        }
        if (!currentClass) {
            throw createError.NotFound('Class Info Not Found');
        }

        await Promise.all([
            await currentRegister.destroy(options, { transaction: t }),
            await currentUserClass.destroy(options, { transaction: t })
        ]);

        if (currentClass.currentNumber > 0) {
            currentClass.decrement('currentNumber', { by: 1 }, { transaction: t });
            return res.json({
                status: true
            });
        }
        currentClass.update({
            currentNumber: 0
        }, { transaction: t });

        await t.commit();
        res.json({
            status: true
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const confirmRegister = async (req, res, next) => {
    try {
        const { userId, classId } = req.body;
        const currentRegister = await db.Register.findOne({
            where: {
                userId,
                classId
            }
        });
        const currentClass = await db.Class.findOne({
            where: {
                id: classId
            }
        });
        const user = await db.User.findOne({
            where: {
                id: userId
            },
            raw: true
        });

        if (!currentRegister) {
            throw createError.NotFound('Register Info Found Data');
        }
        if (!user) {
            throw createError.NotFound('User Not Found ');
        }
        if (!currentClass) {
            throw createError.NotFound('Clas Not Found');
        }

        await currentRegister.update({
            status: CONSTANT_ADMIN.STATUS_CONFIRM
        });

        const message = {
            from: process.env.EMAIL_SERVER,
            to: user.email,
            subject: `Thank to Register ${currentClass.name} Coure `,
            html: `<p>Your have register Coure From us</p>
                <p>Thank You</p>
            <p>See You Again</p>`
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                throw createError.InternalServerError('Error from server');
            } else {
                console.log('Email sent: ', info);
            }
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const checkIsRegister = async (req, res, next) => {
    try {
        const { user } = req;
        const data = await db.Class.findAll({
            attributes: ['id'],
            include: [
                {
                    model: db.UserClass,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: db.User,
                            required: true,
                            attributes: []
                            // where: {
                            //     id: user.id
                            // }
                        }]
                }

            ],
            raw: true,
            where: {
                '$UserClasses.User.id$': user.id
            }

        });
        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
};

// eslint-disable-next-line max-len
const queryWhere = (clauseWhere, status = false) => (status ? { ...clauseWhere, status } : clauseWhere);
export const searchRegisters = async (req, res, next) => {
    try {
        const { page } = req.query || FILTER_PARAMS.PAGE;
        const { limit } = req.query || FILTER_PARAMS.LIMIT;
        const { status } = req.query || FILTER_PARAMS.STATUS;
        const { search } = req.query || FILTER_PARAMS.SEARCH;
        const offset = +(page - 1) * limit;
        const clauseWhere = {
            [Op.or]: [
                {
                    '$user.fullname$': { [Op.like]: `%${search}%` }

                },
                {
                    '$user.email$': { [Op.like]: `%${search}%` }

                },
                {
                    '$Class.name$': { [Op.like]: `%${search}%` }

                }
            ]
        };

        const data = await db.Register.findAndCountAll({
            attributes: ['userId', 'classId', 'status'],
            order: [
                ['createdAt', 'DESC']
            ],
            as: 'register',
            include: [
                {
                    model: db.User,
                    attributes: ['fullname', 'email', 'phone', 'address'],
                    required: true,
                    as: 'user'
                },
                {
                    model: db.Class,
                    attributes: ['name'],
                    required: true
                }
            ],
            offset,
            limit: +limit,
            where: queryWhere(clauseWhere, status),
            raw: true,
            nest: true
        });
        return res.json({
            records: data.rows,
            pagination: {
                limit: +limit,
                page: +page,
                total: data.count
            }
        });
    } catch (error) {
        next(error);
    }
};
