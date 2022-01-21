import Joi from 'joi';

export const validateInforTime = (data) => {
    const inforTime = Joi.object({
        timeStart: Joi.string().required(),
        timeEnd: Joi.string().required()
    });
    return inforTime.validate(data);
};
