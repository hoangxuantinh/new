import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { client } from '../config/connectRedis';
import db from '../models/index';

export const signAccessToken = async (userId) => new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: '24h'
    };

    jwt.sign(payload, secret, options, (error, token) => {
        if (error) reject(error);
        resolve(token);
    });
});

export const signRefreshToken = (userId) => new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
        expiresIn: '1Y'
    };
    jwt.sign(payload, secret, options, async (error, token) => {
        if (error) reject(error);
        client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err) => {
            if (err) {
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
});

export const middleWareVerify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next(createError.Unauthorized());
    }
    const bearerToken = authHeader?.split(' ');
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, payload) => {
        try {
            if (error) {
                if (error.name === 'JsonWebTokenError') {
                    next(createError.Unauthorized());
                }
                next(createError.Unauthorized(error.message));
            }
            const user = await db.User.findOne({
                where: {
                    id: payload.userId
                }
            });
            if (!user) {
                throw createError.NotFound('User Not Found');
            }
            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    });
};

export const verifyRefreshToken = async (refreshToken) => new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
        if (error) {
            reject(error);
        }
        client.get(payload.userId, (err, reply) => {
            if (err) {
                createError.InternalServerError();
            }
            if (refreshToken === reply) {
                resolve(payload);
            }
            reject(createError.Unauthorized());
        });
    });
});
