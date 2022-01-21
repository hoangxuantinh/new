const Joi = require('@hapi/joi');

export const registerSchema = Joi.object({
  fullname: Joi.string().min(8).required(),
  password: Joi.string()
    .min(8)
    .regex(/[a-f0-9]{2,32}/)
    .required(),
});

export const loginSchema = Joi.object({
  fullname: Joi.string().min(8).required(),
  password: Joi.string()
    .min(8)
    .regex(/[a-f0-9]{2,32}/)
    .required(),
});
