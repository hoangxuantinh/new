import Joi from 'joi';

export const validateInforRegister = (data) => {
    const userSchema = Joi.object({
        fullname: Joi.string().min(6).required(),
        // eslint-disable-next-line prefer-regex-literals
        password: Joi.string().pattern(new RegExp(/[a-f0-9]{2,32}/)).required(),
        retypePassword: Joi.string().required().valid(Joi.ref('password'))
            .messages({ 'any.only': 'retypePassword Invalid' }),
        email: Joi.string().email().messages({ 'any.only': 'This Field Must Be Email' }).required(),
        phone: Joi.number().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        role: Joi.string()
    });
    return userSchema.validate(data);
};
export const validateInforLogin = (data) => {
    const userSchema = Joi.object({
        password: Joi.string().required(),
        email: Joi.string().email().required()
    });
    return userSchema.validate(data);
};

export const validateInforProfile = (data) => {
    const userSchema = Joi.object({
        fullname: Joi.string().min(6).required(),
        phone: Joi.number().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        role: Joi.string().required()
    });
    return userSchema.validate(data);
};
