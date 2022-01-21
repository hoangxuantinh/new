import createError from 'http-errors';
import db from '../models/index';
import { validateInforTime } from '../validations/time.validate';

export const create = async (req, res, next) => {
    try {
        const { timeStart, timeEnd } = req.body;
        const { error } = validateInforTime({ timeStart, timeEnd });
        if (error) {
            throw createError.BadRequest('Time Infor not valid');
        }
        await db.Times.create({
            timeStart,
            timeEnd
        });
        res.send({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const times = await db.Times.findAll({
            attributes: ['id', 'timeStart', 'timeEnd'],
            raw: true
        });
        res.send({
            times
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTime = async (req, res, next) => {
    try {
        const { id } = req.params;
        const time = await db.Times.findOne({
            where: {
                id
            }
        });
        if (!time) {
            throw createError.NotFound('Time not found');
        }
        await time.destroy({
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

export const editTime = async (req, res, next) => {
    try {
        const { timeStart, timeEnd } = req.body;
        const { id } = req.params;
        const { error } = validateInforTime({ timeStart, timeEnd });
        if (error) {
            throw createError.BadRequest('Time Infor not valid');
        }
        const time = await db.Times.findOne({
            where: {
                id
            }
        });

        if (!time) {
            throw createError.NotFound('Time Not Found');
        }
        await time.update({
            timeStart,
            timeEnd
        });

        res.send({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const getTimeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const time = await db.Times.findOne({
            where: {
                id
            }
        });
        if (!time) {
            throw createError.NotFound('Time not found');
        }
        res.json({
            time
        });
    } catch (error) {
        next(error);
    }
};
