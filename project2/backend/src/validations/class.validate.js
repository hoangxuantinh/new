import Joi from 'joi';

export const validateInforClass = (data) => {
    const inforClass = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().min(6).required(),
        description: Joi.string().min(8).required(),
        currentNumber: Joi.number().min(0).required(),
        maxNumber: Joi.number().integer().min(Joi.ref('currentNumber')).required(),
        periods: Joi.array().required()
    });
    return inforClass.validate(data);
};
export const validateInforAddClass = (data) => {
    const inforClass = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        currentNumber: Joi.number().min(0).required(),
        maxNumber: Joi.number().integer().min(Joi.ref('currentNumber')).required(),
        periods: Joi.array().required()
    });
    return inforClass.validate(data);
};
