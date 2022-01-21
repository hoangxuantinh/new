import Joi from 'joi';

export const validateInforUser = (data) => {
    const inforUser = Joi.object({
        fullname: Joi.string().required(),
        // eslint-disable-next-line prefer-regex-literals
        password: Joi.string().pattern(new RegExp(/[a-f0-9]{2,32}/)).required(),
        email: Joi.string().email().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        role: Joi.string().required()
    });
    return inforUser.validate(data);
};

export const validateInforUserUpdate = (data) => {
    const inforUser = Joi.object({
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        role: Joi.string().required()
    });
    return inforUser.validate(data);
};
