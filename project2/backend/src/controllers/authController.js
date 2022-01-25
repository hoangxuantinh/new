import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import createError from 'http-errors';
import { client } from '../config/connectRedis';
import db from '../models/index';
import { hashPassword } from '../ultils/bcryptjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../middleware/verifyToken';
import transporter from '../ultils/sendEmail';
import handleDeteleFile from '../ultils/removeFile';
import { validateInforLogin, validateInforProfile, validateInforRegister } from '../validations/auth.validate';

export const register = async (req, res, next) => {
    try {
        const { user } = req.body;
        const fileSaveInServer = req?.file?.filename;
        console.log('🚀 ~ file: authController.js ~ line 16 ~ register ~ fileSaveInServer', fileSaveInServer);
        const dataPlainFromClient = JSON.parse(user);
        console.log('🚀 ~ file: authController.js ~ line 17 ~ register ~ dataPlainFromClient', dataPlainFromClient);
        const { error } = validateInforRegister(dataPlainFromClient);

        if (error) {
            console.log('🚀 ~ file: authController.js ~ line 21 ~ register ~ error', error);
            handleDeteleFile(fileSaveInServer);
            throw createError(error.details[0].message);
        }
        const {
            email, password, phone, address, gender, fullname, role
        } = dataPlainFromClient;
        const isExist = await db.User.findOne({
            where: {
                email
            }
        });
        console.log('🚀 ~ file: authController.js ~ line 33 ~ register ~ isExist', isExist);
        if (isExist) {
            handleDeteleFile(fileSaveInServer);
            throw createError.Conflict(`${email} has already exist`);
        }

        const passwordInServer = await hashPassword(password);
        const dt = new Date();
        console.log('đén đây r nè');
        const newUser = await db.User.create({
            fullname,
            email,
            password: passwordInServer,
            isVerified: false,
            tokenEmail: crypto.randomBytes(32).toString('hex'),
            phone,
            gender,
            address,
            role: role || 'user',
            avatar: fileSaveInServer,
            timeVerify: dt.setMinutes(dt.getMinutes() + 3)
        });
        console.log('🚀 ~ file: authController.js ~ line 54 ~ register ~ newUser', newUser);

        const token = await signAccessToken(newUser.id);
        console.log('🚀 ~ file: authController.js ~ line 57 ~ register ~ token', token);
        const refreshToken = await signRefreshToken(newUser.id);
        const message = {
            from: process.env.EMAIL_ADMIN,
            to: email,
            subject: 'Verify Email Madison',
            html: `<a href="${process.env.REACT_URL_CLIENT}/register/confirm?id=${newUser.id}&token=${newUser.tokenEmail}">
             Click HERE</a>
            `
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('🚀 ~ file: authController.js ~ line 67 ~ transporter.sendMail ~ err', err);
                throw createError.BadRequest('Wrong From St');
            } else {
                console.log('Email sent: ', info);
            }
        });
        console.log('thành công');
        res.json({
            access_token: token,
            refresh_token: refreshToken,
            user: newUser
        });
    } catch (error) {
        next(error);
    }
};

export const confirmEmail = async (req, res, next) => {
    try {
        const { id, token } = req.body;
        const user = await db.User.findOne({
            where: {
                id
            }
        });
        if (!user) {
            throw createError.NotFound('User Not Found');
        }
        const isExpire = new Date() > user.timeVerify;
        if (isExpire) {
            throw createError.Unauthorized('Token email has been expire');
        }
        if (user.tokenEmail !== token) {
            throw createError.Unauthorized('Token Invalid');
        }
        await user.update({
            isVerified: true
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = validateInforLogin({ email, password });

        if (error) {
            throw createError(error.details[0].message);
        }
        const user = await db.User.findOne({
            where: {
                email
            }
        });
        if (!user) {
            throw createError.NotFound(`${email} isn't exist`);
        }
        if (!user.isVerified) {
            throw createError.Unauthorized('Your account has not been confirmed email!');
        }
        // check match
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw createError.Unauthorized('password not valid');
        }

        const token = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        const userPlain = JSON.parse(JSON.stringify(user));
        delete userPlain.password;
        res.json({
            access_token: token,
            refresh_token: refreshToken,
            user: userPlain
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        let { user } = req;
        user = JSON.parse(JSON.stringify(user));
        delete user.password;
        res.send({
            user
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: tokenRefresh } = req.body;
        if (!refreshToken) {
            throw createError.BadRequest();
        }

        const { userId } = await verifyRefreshToken(tokenRefresh);
        const token = await signAccessToken(userId);
        const refresherTokenResponse = await signRefreshToken(userId);
        res.json({
            token,
            refresherTokenResponse
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { user } = req;
        client.del(user.id.toString(), (err) => {
            if (err) {
                throw createError.InternalServerError();
            }
            res.json({
                status: true
            });
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const data = req.body;
        const { user } = req;
        const isMatch = await bcrypt.compareSync(data.password, user.password);
        if (!isMatch) {
            throw createError.Unauthorized('Old Password not valid');
        }
        const newPassword = await hashPassword(data.newPassword);
        await user.update({
            password: newPassword
        });
        res.json({
            status: true
        });
    } catch (error) {
        next(error);
    }
};

export const changeProfile = async (req, res, next) => {
    try {
        const { body, user, file } = req;
        const fileSaveInServer = file?.filename;
        const dataPlainFromClient = JSON.parse(body.inforUser);
        const {
            fullname, phone, address, gender
        } = dataPlainFromClient;
        const { error } = validateInforProfile(dataPlainFromClient);

        if (error) {
            handleDeteleFile(fileSaveInServer);
            throw createError(error.details[0].message);
        }
        await user.update({
            fullname,
            phone,
            address,
            gender,
            avatar: fileSaveInServer || user.avatar
        });
        const response = JSON.parse(JSON.stringify(user));
        delete response.password;

        res.json({
            status: true,
            userInfor: response
        });
    } catch (error) {
        next(error);
    }
};
