/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import createError from 'http-errors';
import { QueryTypes } from 'sequelize';
import handleDeteleFile from '../ultils/removeFile';
import db from '../models/index';
import { validateInforAddClass, validateInforClass } from '../validations/class.validate';
import { checkTimeIsExist } from '../ultils/checkTimeIsExist';
import FILTER_PARAMS from '../constants/filterParams';

export const addClass = async (req, res, next) => {
    try {
        const { newClass } = req.body;
        const fileSaveInServer = req.file?.filename;
        const classPlain = JSON.parse(newClass);
        const {
            name, description, currentNumber, maxNumber, periods
        } = classPlain;
        // validate in server
        const { error } = validateInforAddClass(classPlain);

        if (error) {
            handleDeteleFile(fileSaveInServer);
            throw createError(error.details[0].message);
        }

        const classAdd = await db.Class.create({
            name,
            avatar: fileSaveInServer,
            description,
            maxNumber,
            currentNumber
        });
        const bulkData = converDataForBulk(periods, classAdd.id);
        await db.ClassTime.bulkCreate(bulkData);
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const getFeatures = async (req, res, next) => {
    try {
        const dayOfWeeks = await db.DayOfWeek.findAll();
        const timeList = await db.Times.findAll();
        res.json({
            dayOfWeeks,
            timeList
        });
    } catch (error) {
        next(error);
    }
};

const handleClassesResponse = (classes) => {
    const listClass = [];
    classes.forEach((classItem) => {
        const curentIndex = listClass.findIndex((item) => item.id === classItem.id);
        let templateClass = {
            id: classItem.id,
            name: classItem.name,
            avatar: classItem.avatar,
            description: classItem.description,
            maxNumber: classItem.maxNumber,
            currentNumber: classItem.currentNumber
        };

        const time = {
            timeStart: classItem.timeStart,
            timeEnd: classItem.timeEnd,
            timeId: classItem.timeId
        };
        const dayInfor = {
            dayName: classItem.dayName,
            dayId: classItem.dayId,
            times: [time]
        };

        if (curentIndex === -1) {
            templateClass = {
                ...templateClass,
                days: [
                    dayInfor
                ]
            };
            listClass.push(templateClass);
        } else {
            const curentDayIndex = listClass[curentIndex].days.findIndex((item) => item.dayId === classItem.dayId);
            const days = [...listClass[curentIndex].days];
            if (curentDayIndex === -1) {
                days.push(dayInfor);
            } else {
                days[curentDayIndex].times.push(time);
            }
            templateClass = {
                ...templateClass,
                days: days.sort((dayOne, dayTwo) => (dayOne.dayId - dayTwo.dayId))
            };
            listClass.splice(curentIndex, 1, templateClass);
        }
    });
    return listClass;
};

export const getAll = async (req, res, next) => {
    try {
        const page = req.query.page || FILTER_PARAMS.PAGE;
        const limit = req.query.limit || FILTER_PARAMS.LIMIT;
        const offset = +(page - 1) * limit;

        const sql = `SELECT c.*, times.timeStart, times.timeEnd,
        d.name dayName,d.id dayId, times.id timeId
        FROM (SELECT * FROM classes ORDER BY createdAt DESC LIMIT :offset, :limit) c
        INNER JOIN classtimes ct ON c.id = ct.classId
        INNER JOIN times ON ct.timeId = times.id
        INNER JOIN dayofweeks d ON ct.dayId = d.id`;
        const totalRow = await db.Class.count();
        let classes = await db.sequelize.query(
            sql,
            { replacements: { offset, limit: +limit } },
            { type: QueryTypes.SELECT }
        );
        classes = handleClassesResponse(classes[0]);

        res.json({
            records: classes,
            pagination: {
                limit: +limit,
                page: +page,
                total: totalRow
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllForClient = async (req, res, next) => {
    try {
        const offset = +req.query.offset || FILTER_PARAMS.OFFSET;
        const limit = +req.query.limit || FILTER_PARAMS.LIMIT;
        const sql = `SELECT c.*, times.timeStart, times.timeEnd,
        d.name dayName,d.id dayId, times.id timeId
        FROM (SELECT * FROM classes ORDER BY createdAt DESC LIMIT :offset, :limit) c
        INNER JOIN classtimes ct ON c.id = ct.classId
        INNER JOIN times ON ct.timeId = times.id
        INNER JOIN dayofweeks d ON ct.dayId = d.id`;

        const totalRow = await db.Class.count();
        let classes = await db.sequelize.query(
            sql,
            { replacements: { offset, limit: +limit } },
            { type: QueryTypes.SELECT }
        );
        classes = handleClassesResponse(classes[0]);

        res.json({
            records: classes,
            pagination: {
                limit: +limit,
                total: totalRow
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getClassById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = `SELECT DISTINCT  c.*, times.timeStart, times.timeEnd,
        d.name dayName, d.id dayId, times.id timeId FROM classes c
        INNER JOIN classtimes ct ON c.id = ct.classId
        INNER JOIN times ON ct.timeId = times.id
        INNER JOIN dayofweeks d ON ct.dayId = d.id
        WHERE c.id = :id;`;

        let data = await db.sequelize.query(
            sql,
            { replacements: { id } },
            { type: QueryTypes.SELECT }
        );
        data = handleClassesResponse(data[0]);
        res.json({
            data
        });
    } catch (error) {
        next(error);
    }
};

export const updateClass = async (req, res, next) => {
    try {
        const fileInServer = req.file?.filename || null;
        const { classEdit } = req.body;
        const classPlain = JSON.parse(classEdit);
        const {
            name, description, currentNumber, maxNumber, periods
        } = classPlain;
        const { error } = validateInforClass(classPlain);

        if (error) {
            throw createError(error.details[0].message);
        }
        if (checkTimeIsExist(periods)) {
            throw createError.BadRequest('Can\'t select same period time!');
        }
        const editClass = await db.Class.findOne({
            where: {
                id: classPlain.id
            }
        });
        if (fileInServer) {
            handleDeteleFile(fileInServer);
        }
        if (periods.length > 0) {
            await db.ClassTime.destroy({
                where: {
                    classId: editClass.id
                }
            });
            const bulkData = converDataForBulk(periods, editClass.id);
            await db.ClassTime.bulkCreate(bulkData);
        }
        editClass.update({
            name,
            description,
            currentNumber,
            maxNumber,
            avatar: fileInServer || editClass.avatar
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const deleteClass = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const currentClass = await db.Class.findOne({
            where: {
                id
            }
        });
        if (!currentClass) {
            throw createError.NotFound('Current Class Found Class');
        }
        if (currentClass.avatar) {
            handleDeteleFile(currentClass.avatar);
        }
        await db.Class.destroy({
            where: {
                id
            }
        }, { transaction: t });
        await db.ClassTime.destroy({
            where: {
                classId: id
            }
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

function converDataForBulk(periods, classId) {
    if (!Array.isArray(periods) || periods.length <= 0) return [];
    const data = [];
    periods.forEach((item) => {
        const instance = {};
        instance.classId = classId;
        instance.timeId = item.timeId;
        instance.dayId = item.dayId;
        data.push(instance);
    });
    return data;
}
