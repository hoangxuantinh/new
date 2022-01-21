import createError from 'http-errors';
import CONSTANT_ADMIN from '../constants/constant';

export const middleWareAuthor = async (req, res, next) => {
    try {
        const { user } = req;
        const { role } = user;
        if (role !== CONSTANT_ADMIN.ROLE) {
            throw createError.Forbidden();
        }
        next();
    } catch (error) {
        next(error);
    }
};
